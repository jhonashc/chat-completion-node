import OpenAI from 'openai';
import type {
  ChatCompletion,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionTool,
  ChatModel,
} from 'openai/resources/chat';

import { getToolOutput } from './tools';

type Options = {
  model: ChatModel;
  maxTokens?: number;
  temperature?: number;
  messages: ChatCompletionMessageParam[];
  tools?: ChatCompletionTool[];
};

export const chatCompletion = async (
  openAi: OpenAI,
  { model, maxTokens = 256, temperature = 0, messages, tools }: Options,
): Promise<ChatCompletion.Choice | undefined> => {
  const response: ChatCompletion = await openAi.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    tools,
  });

  return response.choices[0];
};

export const getToolMessages = async (
  responseMessage: ChatCompletionMessage,
): Promise<ChatCompletionMessageParam[]> => {
  // Append the original function calls to the conversation
  const messages: ChatCompletionMessageParam[] = [responseMessage];

  // Get the tool calls
  const toolCalls: ChatCompletionMessageToolCall[] = responseMessage.tool_calls ?? [];

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

    messages.push(functionResponseMessage);
  }

  return messages;
};
