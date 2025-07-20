// 聊天相关类型
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

// 知识库相关类型
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  description?: string;
}

// API 响应类型
export interface ChatResponse {
  answer: string;
  timestamp: string;
  error?: string;
  debug?: {
    message: string;
    suggestion: string;
  };
}

export interface ApiError {
  error: string;
  details?: string;
  timestamp?: string;
}

// 环境变量检查类型
export interface EnvironmentStatus {
  hasOpenAIKey: boolean;
  openAIKeyLength: number;
  openAIKeyPrefix: string | null;
  apiBase: string;
  modelName: string;
  nodeEnv: string;
  timestamp: string;
}

export interface TestEnvResponse {
  status: 'success' | 'error';
  environment?: EnvironmentStatus;
  allEnvKeys?: string[];
  message?: string;
  error?: string;
  details?: string;
}

// 表单相关类型
export interface NewKnowledgeItem {
  title: string;
  content: string;
  category: string;
}

// 常用的联合类型
export type MessageRole = 'user' | 'assistant';
export type ApiStatus = 'success' | 'error' | 'loading';