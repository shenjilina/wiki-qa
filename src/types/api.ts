// 重新导出主要的 API 相关类型
export type { 
  ChatResponse, 
  ApiError, 
  EnvironmentStatus, 
  TestEnvResponse, 
  ApiStatus 
} from './index';

// API 请求类型
export interface ChatRequest {
  message: string;
  streaming?: boolean;
  sessionId?: string;
}

export interface TestEnvRequest {
  // 测试环境变量请求通常不需要参数
}

// API 响应的通用结构
export interface BaseApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// 错误处理类型
export interface ApiErrorDetails {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}