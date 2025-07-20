import { NextRequest, NextResponse } from "next/server";
import type { ChatRequest, ChatResponse } from "@/types/api";
import { apiLogger, envLogger, logError, logInfo } from "@/lib/logger";
import { 
  createChatModel, 
  createQAChain, 
  createStreamingQAChain, 
  executeQA, 
  executeStreamingQA,
  type ModelConfig 
} from "@/lib/chains";
import { globalMemoryManager } from "@/lib/memory";

export async function POST(request: NextRequest) {
  try {
    const { message, streaming = false, sessionId = 'default' }: ChatRequest = await request.json();

    if (!message) {
      return NextResponse.json({ error: "请提供问题内容" }, { status: 400 });
    }

    logInfo('ChatAPI', '收到聊天请求', { 
      messageLength: message.length,
      streaming,
      sessionId 
    });

    // 检查是否设置了 OpenAI API Key
    const apiKey = process.env.OPENAI_API_KEY;
    const apiBase = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
    const modelName = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

    // 调试信息
    envLogger.debug("环境变量检查", {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiBase,
      modelName,
      nodeEnv: process.env.NODE_ENV
    });

    if (!apiKey) {
      const errorResponse: ChatResponse = {
        error: "请在 .env.local 文件中设置 OPENAI_API_KEY",
        answer: "抱歉，系统配置不完整。请在项目根目录的 .env.local 文件中设置您的 OpenAI API Key。",
        timestamp: new Date().toISOString(),
        debug: {
          message: "未找到 OPENAI_API_KEY 环境变量",
          suggestion: "请确保 .env.local 文件存在且包含有效的 OPENAI_API_KEY"
        }
      };
      
      logError('ChatAPI', '缺少 API Key', { hasApiKey: false });
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // 创建模型配置
    const modelConfig: ModelConfig = {
      apiKey,
      apiBase,
      modelName,
      temperature: 0.7,
      maxTokens: 500,
      streaming
    };

    // 创建模型
    const model = createChatModel(modelConfig);

    // 处理流式输出
    if (streaming) {
      try {
        const streamingChain = createStreamingQAChain(model);
        const stream = await executeStreamingQA(streamingChain, message);
        
        logInfo('ChatAPI', '开始流式响应', { 
          questionLength: message.length,
          sessionId 
        });

        // 记录到内存（异步处理，不阻塞响应）
        setTimeout(() => {
          globalMemoryManager.addConversation(sessionId, message, '[流式响应]');
        }, 0);

        return new NextResponse(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (error) {
        logError('ChatAPI', error, { 
          endpoint: '/api/chat',
          method: 'POST',
          streaming: true
        });
        
        const errorResponse: ChatResponse = {
          error: "流式处理请求时发生错误",
          answer: "抱歉，系统暂时无法处理您的问题，请稍后再试。",
          timestamp: new Date().toISOString(),
        };
        
        return NextResponse.json(errorResponse, { status: 500 });
      }
    }

    // 处理标准输出
    try {
      const qaChain = createQAChain(model);
      const response = await executeQA(qaChain, message);

      const chatResponse: ChatResponse = {
        answer: response,
        timestamp: new Date().toISOString(),
      };

      // 记录到内存
      globalMemoryManager.addConversation(sessionId, message, response);

      logInfo('ChatAPI', '成功生成回答', { 
        responseLength: response.length,
        questionLength: message.length,
        sessionId 
      });

      return NextResponse.json(chatResponse);
    } catch (error) {
      logError('ChatAPI', error, { 
        endpoint: '/api/chat',
        method: 'POST',
        streaming: false
      });
      
      const errorResponse: ChatResponse = {
        error: "处理请求时发生错误",
        answer: "抱歉，系统暂时无法处理您的问题，请稍后再试。",
        timestamp: new Date().toISOString(),
      };
      
      return NextResponse.json(errorResponse, { status: 500 });
    }
  } catch (error) {
    logError('ChatAPI', error, { 
      endpoint: '/api/chat',
      method: 'POST',
      context: 'request_parsing'
    });
    
    const errorResponse: ChatResponse = {
      error: "解析请求时发生错误",
      answer: "抱歉，请求格式不正确，请检查输入内容。",
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
