'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Space, 
  Typography, 
  message as antMessage,
  Row,
  Col,
  Tooltip,
  Tag,
  Button,
  Divider
} from 'antd';
import { 
  ClearOutlined, 
  IdcardOutlined,
  MessageOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { 
  Bubble, 
  Sender, 
  useXChat, 
  useXAgent 
} from '@ant-design/x';
import type { ChatRequest, ChatResponse } from '@/types/api';
import type { Message } from '@/types';

const { Paragraph, Title } = Typography;

const ChatInterface: React.FC = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSessionId(`session_${Date.now()}`);
    setMounted(true);
  }, []);

  // 使用 useXAgent 管理 AI 代理
  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { message: userMessage } = info;
      const { onUpdate, onSuccess, onError } = callbacks;

      try {
        // 构建请求数据
        const requestData: ChatRequest = {
          message: userMessage,
          streaming: true,
          sessionId: sessionId
        };

        // 发送请求到 /api/chat
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData: ChatResponse = await response.json();
          throw new Error(errorData.error || '请求失败');
        }

        // 检查是否是流式响应
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('text/plain')) {
          // 处理流式响应
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let currentContent = '';

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              currentContent += chunk;
              onUpdate(currentContent);
            }
          }

          onSuccess(currentContent);
        } else {
          // 处理标准 JSON 响应
          const data: ChatResponse = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }
          onSuccess(data.answer);
        }
      } catch (error) {
        console.error('Chat API 请求失败:', error);
        onError(error as Error);
        antMessage.error('发送消息失败，请检查网络连接');
      }
    },
  });

  // 使用 useXChat 管理聊天数据流
  const { messages, onRequest } = useXChat({
    agent,
  });

  const clearChat = () => {
    // 清空消息（需要重新初始化 useXChat）
    window.location.reload(); // 临时解决方案
    antMessage.success('会话已清除');
  };

  if (!mounted) {
    return null; // 避免 hydration 不匹配
  }

  // 转换消息格式为 Bubble.List 需要的格式
  const bubbleItems = messages.map((msg) => {
    // 确定消息角色
    const role = msg.role || (msg.message ? 'user' : 'assistant');
    
    return {
      key: msg.id,
      content: msg.message || msg.content || '',
      role: role,
      avatar: role === 'user' ? 
        { style: { backgroundColor: '#52c41a' } } : 
        { icon: <RobotOutlined />, style: { backgroundColor: '#1890ff' } },
      styles: {
        content: {
          background: role === 'user' 
            ? 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)' 
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          color: role === 'user' ? '#ffffff' : '#333333',
          borderRadius: '12px',
          boxShadow: role === 'user' 
            ? '0 4px 12px rgba(24, 144, 255, 0.3)' 
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: role === 'assistant' ? '1px solid #e8e8e8' : 'none',
        }
      }
    };
  });

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: 0
    }}>
      {/* 控制面板 */}
      <Card 
        size="small" 
        style={{ 
          marginBottom: '16px',
          background: 'linear-gradient(45deg, #f0f2f5, #fafafa)',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          flexShrink: 0
        }}
      >
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space size="middle">
              <Tooltip title="会话标识符">
                <Tag icon={<IdcardOutlined />} color="blue">
                  {sessionId.slice(-8)}
                </Tag>
              </Tooltip>
              <Tag icon={<MessageOutlined />} color="green">
                {messages.length} 条消息
              </Tag>
            </Space>
          </Col>
          
          <Col>
            <Button 
              type="default" 
              size="small"
              icon={<ClearOutlined />}
              onClick={clearChat}
              disabled={messages.length === 0}
              style={{ borderRadius: '6px' }}
            >
              清除对话
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 消息列表区域 - 使用 Bubble.List */}
      <div 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '0 8px',
          marginBottom: '16px',
          scrollBehavior: 'smooth',
          minHeight: 0
        }}
      >
        {messages.length === 0 ? (
          <Card 
            style={{ 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f6f9fc 0%, #e9f4ff 100%)',
              border: '2px dashed #91d5ff',
              borderRadius: '12px',
              padding: '40px 20px'
            }}
          >
            <RobotOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={4} style={{ color: '#1890ff', marginBottom: '8px' }}>
              欢迎使用智能知识问答系统
            </Title>
            <Paragraph style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              请在下方输入您的问题，我将为您提供详细的回答
            </Paragraph>
          </Card>
        ) : (
          <Bubble.List 
            items={bubbleItems}
            style={{ width: '100%' }}
          />
        )}
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* 输入区域 - 使用 Sender */}
      <div style={{ flexShrink: 0 }}>
        <Sender
          onSubmit={onRequest}
          placeholder="请输入您的问题..."
          loading={agent.isRequesting()}
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid #e8e8e8',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
        
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px', 
          color: '#999',
          textAlign: 'center'
        }}>
          按 Enter 发送消息 • 支持多轮对话 • AI 智能回复
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
