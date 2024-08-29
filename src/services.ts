import OpenAI from 'openai';
import {
  ChatCompletion,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatModel,
} from 'openai/resources';

import { generatePrompt } from './prompt';
import { getToolOutput, TOOLS } from './tools';

type Options = {
  prompt: string;
};

export const runConversation = async (openAi: OpenAI, { prompt }: Options): Promise<string | null> => {
  const model: ChatModel = 'gpt-3.5-turbo';

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: generatePrompt(),
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response: ChatCompletion = await openAi.chat.completions.create({
    model,
    messages,
    tools: TOOLS,
    tool_choice: 'auto',
  });

  const responseMessage: ChatCompletionMessage | null = response.choices[0]?.message ?? null;
  const toolCall: ChatCompletionMessageToolCall | null = responseMessage?.tool_calls?.[0] ?? null;

  if (toolCall) {
    const toolId: string = toolCall.id;
    const functionName: string = toolCall.function.name;
    const functionArgs: unknown = JSON.parse(toolCall.function.arguments);

    const toolOuput: unknown = await getToolOutput(functionName, functionArgs);

    const functionResponseMessage: ChatCompletionMessageParam = {
      role: 'tool',
      content: JSON.stringify(toolOuput),
      tool_call_id: toolId,
    };

    if (responseMessage) {
      messages.push(responseMessage);
      messages.push(functionResponseMessage);
    }

    const secondResponse: ChatCompletion = await openAi.chat.completions.create({
      model,
      messages,
    });

    return secondResponse.choices[0]?.message.content ?? null;
  }

  return responseMessage?.content ?? null;
};

export const runParallelConversation = async (openAi: OpenAI, { prompt }: Options): Promise<string | null> => {
  const model: ChatModel = 'gpt-3.5-turbo';

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: generatePrompt(),
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response: ChatCompletion = await openAi.chat.completions.create({
    model,
    messages,
    tools: TOOLS,
    tool_choice: 'auto',
  });

  const responseMessage: ChatCompletionMessage | null = response.choices[0]?.message ?? null;
  const toolCalls: ChatCompletionMessageToolCall[] | null = responseMessage?.tool_calls ?? null;

  if (toolCalls) {
    if (responseMessage) {
      messages.push(responseMessage);
    }

    for (const toolCall of toolCalls) {
      const toolId: string = toolCall.id;
      const functionName: string = toolCall.function.name;
      const functionArgs: unknown = JSON.parse(toolCall.function.arguments);

      const toolOuput: unknown = await getToolOutput(functionName, functionArgs);

      const functionResponseMessage: ChatCompletionMessageParam = {
        role: 'tool',
        content: JSON.stringify(toolOuput),
        tool_call_id: toolId,
      };

      messages.push(functionResponseMessage);
    }

    const secondResponse: ChatCompletion = await openAi.chat.completions.create({
      model,
      messages,
    });

    return secondResponse.choices[0]?.message.content ?? null;
  }

  return response.choices[0]?.message.content ?? null;
};
