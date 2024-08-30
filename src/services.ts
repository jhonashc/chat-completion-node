import OpenAI from 'openai';
import type {
  ChatCompletion,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatModel,
} from 'openai/resources/chat';

import { chatCompletion, getToolMessages } from './openai';
import { generateSystemPrompt } from './prompt';
import { getToolOutput, TOOLS } from './tools';

type Options = {
  prompt: string;
};

const CHAT_MODEL: ChatModel = 'gpt-3.5-turbo';

export const runConversation = async (openAi: OpenAI, { prompt }: Options): Promise<string | null | undefined> => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: generateSystemPrompt(),
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response: ChatCompletion.Choice | undefined = await chatCompletion(openAi, {
    model: CHAT_MODEL,
    messages,
    tools: TOOLS,
  });

  const responseMessage: ChatCompletionMessage | undefined = response?.message;

  if (!responseMessage) return null; // Handle missing response message

  const toolCalls: ChatCompletionMessageToolCall[] | undefined = responseMessage.tool_calls;

  if (!toolCalls) return responseMessage.content; // No tool calls, return directly

  // Getting new messages from tool calls
  const toolMessages: ChatCompletionMessageParam[] = await getToolMessages(responseMessage);

  // Adding new messages from tool calls
  messages.concat(toolMessages);

  const secondResponse: ChatCompletion.Choice | undefined = await chatCompletion(openAi, {
    model: CHAT_MODEL,
    messages,
  });

  return secondResponse?.message.content;
};
