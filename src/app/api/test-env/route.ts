import { NextRequest, NextResponse } from "next/server";
import type { TestEnvResponse, EnvironmentStatus } from "@/types/api";
import { envLogger, logError, logInfo } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    logInfo('TestEnvAPI', '收到环境变量测试请求');

    // 获取环境变量
    const apiKey = process.env.OPENAI_API_KEY;
    const apiBase = process.env.OPENAI_API_BASE;
    const modelName = process.env.OPENAI_MODEL;
    const nodeEnv = process.env.NODE_ENV;

    const environment: EnvironmentStatus = {
      hasOpenAIKey: !!apiKey,
      openAIKeyLength: apiKey ? apiKey.length : 0,
      openAIKeyPrefix: apiKey ? `${apiKey.substring(0, 7)}...` : null,
      apiBase: apiBase || "未设置（将使用默认值）",
      modelName: modelName || "未设置（将使用默认值）",
      nodeEnv: nodeEnv || "unknown",
      timestamp: new Date().toISOString()
    };

    const response: TestEnvResponse = {
      status: "success",
      environment,
      allEnvKeys: Object.keys(process.env).filter(key => 
        key.startsWith('OPENAI_') || key.startsWith('NEXT_')
      ),
      message: apiKey ? "环境变量配置正常" : "未找到 OPENAI_API_KEY"
    };

    envLogger.info('环境变量检查完成', {
      hasApiKey: environment.hasOpenAIKey,
      envKeysCount: response.allEnvKeys?.length
    });

    return NextResponse.json(response);
  } catch (error) {
    logError('TestEnvAPI', error, { endpoint: '/api/test-env' });
    
    const errorResponse: TestEnvResponse = {
      status: "error",
      error: "测试环境变量时发生错误",
      details: error instanceof Error ? error.message : "未知错误"
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}