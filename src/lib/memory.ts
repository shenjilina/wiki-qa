import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";
import { logInfo, logError } from "./logger";

/**
 * 会话记录接口
 */
export interface ConversationRecord {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

/**
 * 内存管理器类
 */
export class MemoryManager {
  private memory: BufferMemory;
  private conversations: Map<string, ConversationRecord[]>;
  private maxHistoryLength: number;

  constructor(maxHistoryLength: number = 10) {
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
    });
    this.conversations = new Map();
    this.maxHistoryLength = maxHistoryLength;
    
    logInfo('Memory', '初始化内存管理器', { maxHistoryLength });
  }

  /**
   * 创建会话链
   */
  createConversationChain(model: ChatOpenAI): ConversationChain {
    logInfo('Memory', '创建会话链');
    
    return new ConversationChain({
      llm: model,
      memory: this.memory,
      verbose: false,
    });
  }

  /**
   * 添加会话记录
   */
  addConversation(sessionId: string, question: string, answer: string): void {
    try {
      if (!this.conversations.has(sessionId)) {
        this.conversations.set(sessionId, []);
      }

      const conversations = this.conversations.get(sessionId)!;
      const record: ConversationRecord = {
        id: `${sessionId}_${Date.now()}`,
        question,
        answer,
        timestamp: new Date().toISOString(),
      };

      conversations.push(record);

      // 限制历史记录长度
      if (conversations.length > this.maxHistoryLength) {
        conversations.splice(0, conversations.length - this.maxHistoryLength);
      }

      logInfo('Memory', '添加会话记录', { 
        sessionId, 
        recordId: record.id,
        totalRecords: conversations.length 
      });
    } catch (error) {
      logError('Memory', error, { sessionId, operation: 'addConversation' });
    }
  }

  /**
   * 获取会话历史
   */
  getConversationHistory(sessionId: string): ConversationRecord[] {
    const history = this.conversations.get(sessionId) || [];
    logInfo('Memory', '获取会话历史', { sessionId, historyLength: history.length });
    return history;
  }

  /**
   * 清除会话历史
   */
  clearConversationHistory(sessionId: string): void {
    try {
      this.conversations.delete(sessionId);
      logInfo('Memory', '清除会话历史', { sessionId });
    } catch (error) {
      logError('Memory', error, { sessionId, operation: 'clearConversationHistory' });
    }
  }

  /**
   * 获取所有会话ID
   */
  getAllSessionIds(): string[] {
    const sessionIds = Array.from(this.conversations.keys());
    logInfo('Memory', '获取所有会话ID', { sessionCount: sessionIds.length });
    return sessionIds;
  }

  /**
   * 清除所有会话
   */
  clearAllConversations(): void {
    try {
      this.conversations.clear();
      this.memory.clear();
      logInfo('Memory', '清除所有会话');
    } catch (error) {
      logError('Memory', error, { operation: 'clearAllConversations' });
    }
  }

  /**
   * 获取内存使用统计
   */
  getMemoryStats(): {
    totalSessions: number;
    totalRecords: number;
    averageRecordsPerSession: number;
  } {
    const totalSessions = this.conversations.size;
    const totalRecords = Array.from(this.conversations.values())
      .reduce((sum, records) => sum + records.length, 0);
    const averageRecordsPerSession = totalSessions > 0 ? totalRecords / totalSessions : 0;

    const stats = {
      totalSessions,
      totalRecords,
      averageRecordsPerSession: Math.round(averageRecordsPerSession * 100) / 100,
    };

    logInfo('Memory', '获取内存统计', stats);
    return stats;
  }
}

/**
 * 全局内存管理器实例
 */
export const globalMemoryManager = new MemoryManager();

/**
 * 获取或创建会话内存
 */
export const getSessionMemory = (sessionId: string = 'default'): MemoryManager => {
  return globalMemoryManager;
};