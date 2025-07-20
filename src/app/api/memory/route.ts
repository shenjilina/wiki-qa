import { NextRequest, NextResponse } from "next/server";
import { globalMemoryManager } from "@/lib/memory";
import { logInfo, logError } from "@/lib/logger";

// GET: 获取会话历史或统计信息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const action = searchParams.get('action') || 'history';

    logInfo('MemoryAPI', '收到内存查询请求', { sessionId, action });

    switch (action) {
      case 'history':
        if (!sessionId) {
          return NextResponse.json({ error: "需要提供 sessionId" }, { status: 400 });
        }
        const history = globalMemoryManager.getConversationHistory(sessionId);
        return NextResponse.json({ 
          success: true, 
          data: history,
          timestamp: new Date().toISOString()
        });

      case 'stats':
        const stats = globalMemoryManager.getMemoryStats();
        return NextResponse.json({ 
          success: true, 
          data: stats,
          timestamp: new Date().toISOString()
        });

      case 'sessions':
        const sessionIds = globalMemoryManager.getAllSessionIds();
        return NextResponse.json({ 
          success: true, 
          data: sessionIds,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({ error: "不支持的操作" }, { status: 400 });
    }
  } catch (error) {
    logError('MemoryAPI', error, { method: 'GET' });
    return NextResponse.json({ 
      error: "获取内存信息时发生错误",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// DELETE: 清除会话历史
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const action = searchParams.get('action') || 'session';

    logInfo('MemoryAPI', '收到内存清除请求', { sessionId, action });

    switch (action) {
      case 'session':
        if (!sessionId) {
          return NextResponse.json({ error: "需要提供 sessionId" }, { status: 400 });
        }
        globalMemoryManager.clearConversationHistory(sessionId);
        return NextResponse.json({ 
          success: true, 
          message: `会话 ${sessionId} 已清除`,
          timestamp: new Date().toISOString()
        });

      case 'all':
        globalMemoryManager.clearAllConversations();
        return NextResponse.json({ 
          success: true, 
          message: "所有会话已清除",
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({ error: "不支持的操作" }, { status: 400 });
    }
  } catch (error) {
    logError('MemoryAPI', error, { method: 'DELETE' });
    return NextResponse.json({ 
      error: "清除内存时发生错误",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}