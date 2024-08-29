import OpenAI from 'openai';
import type {
  ChatCompletion,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatModel,
} from 'openai/resources/chat';

import { chatCompletion } from './openai';
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

  if (!responseMessage) {
    return null; // Handle missing response message
  }

  const toolCalls: ChatCompletionMessageToolCall[] | undefined = responseMessage.tool_calls;

  if (!toolCalls) {
    return responseMessage.content; // No tool calls, return directly
  }

  // Append the original function calls to the conversation
  messages.push(responseMessage);

  for (const toolCall of toolCalls) {
    const toolId: string = toolCall.id;
    const functionName: string = toolCall.function.name;
    const functionArgs: any = JSON.parse(toolCall.function.arguments);

    const toolOutput: any = await getToolOutput(functionName, functionArgs);

    const functionResponseMessage: ChatCompletionMessageParam = {
      role: 'tool',
      content: JSON.stringify(toolOutput),
      tool_call_id: toolId,
    };

    // Include the result of the function calls
    messages.push(functionResponseMessage);
  }

  // Call the OpenAI API's chat completions endpoint to send the tool call result back to the model
  const secondResponse: ChatCompletion.Choice | undefined = await chatCompletion(openAi, {
    model: CHAT_MODEL,
    messages,
  });

  return secondResponse?.message.content;
};
