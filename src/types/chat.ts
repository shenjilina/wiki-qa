import { Message } from './index';

// 重新导出主要的聊天相关类型
export type { ChatResponse, MessageRole } from './index';

// 聊天特定的扩展类型
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatActions {
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  setError: (error: string | null) => void;
}
