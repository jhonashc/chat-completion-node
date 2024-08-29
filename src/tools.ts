import { ChatCompletionTool } from 'openai/resources';

import { getCostOfLiving, getRandomCity, getWeather } from './functions';

import tools from '../tools.json';

export const TOOLS = tools as ChatCompletionTool[];

export const getToolOutput = async (functionName: string, functionArgs: any) => {
  switch (functionName) {
    case 'getWeather':
      return getWeather(functionArgs);

    case 'getCostOfLiving':
      return getCostOfLiving(functionArgs);

    case 'getRandomCity':
      return getRandomCity();

    default:
      return { error: 'unknown function', message: 'function not found' };
  }
};
