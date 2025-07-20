import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { createQAPrompt, createStreamingQAPrompt, KNOWLEDGE_BASE } from "./prompts";
import { logInfo, logError } from "./logger";

/**
 * OpenAI 模型配置接口
 */
export interface ModelConfig {
  apiKey: string;
  apiBase?: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
}

/**
 * 创建 ChatOpenAI 模型实例
 */
export const createChatModel = (config: ModelConfig): ChatOpenAI => {
  const {
    apiKey,
    apiBase,
    modelName,
    temperature = 0.7,
    maxTokens = 500,
    streaming = false
  } = config;

  logInfo('Chains', '创建 ChatOpenAI 模型', { 
    modelName, 
    apiBase, 
    streaming,
    temperature,
    maxTokens 
  });

  return new ChatOpenAI({
    configuration: {
      baseURL: apiBase,
    },
    openAIApiKey: apiKey,
    modelName,
    temperature,
    maxTokens,
    frequencyPenalty: 0.2,
    presencePenalty: 0.1,
    timeout: 30000,
    streaming,
  });
};

/**
 * 创建标准问答链
 */
export const createQAChain = (model: ChatOpenAI) => {
  const prompt = createQAPrompt();
  const outputParser = new StringOutputParser();
  
  logInfo('Chains', '创建标准问答链');
  
  return RunnableSequence.from([
    prompt,
    model,
    outputParser
  ]);
};

/**
 * 创建流式问答链
 */
export const createStreamingQAChain = (model: ChatOpenAI) => {
  const prompt = createStreamingQAPrompt();
  const outputParser = new StringOutputParser();
  
  logInfo('Chains', '创建流式问答链');
  
  return RunnableSequence.from([
    prompt,
    model,
    outputParser
  ]);
};

/**
 * 执行问答
 */
export const executeQA = async (
  chain: RunnableSequence<any, string>,
  question: string
): Promise<string> => {
  try {
    logInfo('Chains', '执行问答', { questionLength: question.length });
    
    const response = await chain.invoke({
      knowledge: KNOWLEDGE_BASE,
      question,
    });
    
    logInfo('Chains', '问答执行成功', { responseLength: response.length });
    return response;
  } catch (error) {
    logError('Chains', error, { question: question.substring(0, 100) });
    throw error;
  }
};

/**
 * 执行流式问答
 */
export const executeStreamingQA = async (
  chain: RunnableSequence<any, string>,
  question: string
): Promise<ReadableStream<Uint8Array>> => {
  try {
    logInfo('Chains', '执行流式问答', { questionLength: question.length });
    
    const stream = await chain.stream({
      knowledge: KNOWLEDGE_BASE,
      question,
    });
    
    // 创建 ReadableStream
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = typeof chunk === 'string' ? chunk : JSON.stringify(chunk);
            controller.enqueue(new TextEncoder().encode(text));
          }
          controller.close();
        } catch (error) {
          logError('Chains', error, { context: 'streaming' });
          controller.error(error);
        }
      }
    });
    
    logInfo('Chains', '流式问答开始');
    return readableStream;
  } catch (error) {
    logError('Chains', error, { question: question.substring(0, 100) });
    throw error;
  }
};