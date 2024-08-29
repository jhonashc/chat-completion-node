import OpenAI from 'openai';
import type { ChatCompletion, ChatCompletionMessageParam, ChatCompletionTool, ChatModel } from 'openai/resources/chat';

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
