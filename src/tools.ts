import { ChatCompletionTool } from 'openai/resources';

import { getRandomCity, getWeather } from './functions';

import tools from '../tools.json';

export const TOOLS = tools as ChatCompletionTool[];

export const getToolOutput = (functionName: string, functionArgs: any) => {
  switch (functionName) {
    case 'getWeather':
      return getWeather(functionArgs);

    case 'getRandomCity':
      return getRandomCity();

    default:
      return { error: true, message: 'Función desconocida' };
  }
};
