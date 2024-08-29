import { OpenAI } from 'openai';

import { runConversation } from './services';

async function main() {
  const openAi: OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const answer: string | null = await runConversation(openAi, {
    prompt: 'Quiero que me digas una ciudad aleatoria del mundo?',
  });

  console.log({ answer });
}

main();
