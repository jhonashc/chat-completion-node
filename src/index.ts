import { OpenAI } from 'openai';

import { runConversation } from './services';

async function main() {
  try {
    const openAi: OpenAI = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    });

    const answer: string | null | undefined = await runConversation(openAi, {
      prompt: `
        What is the cost of living in Bogotá? I want to know how much it would cost to live there, including housing,
        food, transportation, and other expenses.
      `,
    });

    console.log({ answer });
  } catch (error) {
    console.error(error);
  }
}

main();
