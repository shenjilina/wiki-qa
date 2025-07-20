'use client';

import React, { useState } from 'react';
import { 
  Layout, 
  Input, 
  Button, 
  Card, 
  Space, 
  Typography, 
  message,
  Row,
  Col,
  Tooltip,
  Tag,
  Avatar,
  Divider
} from 'antd';
import { 
  SendOutlined, 
  ClearOutlined, 
  UserOutlined, 
  RobotOutlined,
  IdcardOutlined,
  MessageOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { TextArea } = Input;
const { Text, Paragraph, Title } = Typography;

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `您好！您刚才说："${currentInput}"。\n\n这是一个使用 Ant Design 重构的智能聊天界面演示。界面采用了现代化的设计风格，支持：\n\n• 实时消息交互\n• 优雅的用户界面\n• 响应式布局设计\n• 流畅的动画效果\n\n感谢您的使用！`,
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      message.error('发送消息失败，请检查网络连接');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    message.success('会话已清除');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Layout style={{ height: '100%', background: 'transparent' }}>
      <Content style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 控制面板 */}
        <Card 
          size="small" 
          style={{ 
            marginBottom: '16px',
            background: 'linear-gradient(45deg, #f0f2f5, #fafafa)',
            border: '1px solid #e8e8e8',
            borderRadius: '8px'
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
                disabled={isLoading || messages.length === 0}
                style={{ borderRadius: '6px' }}
              >
                清除对话
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 消息列表 */}
        <div 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '0 8px',
            marginBottom: '16px',
            scrollBehavior: 'smooth'
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
              messages.map((msg) => (
                <div key={msg.id} style={{ width: '100%' }}>
                  <Card
                    size="small"
                    style={{
                      marginLeft: msg.role === "user" ? '15%' : '0',
                      marginRight: msg.role === "user" ? '0' : '15%',
                      background: msg.role === "user" 
                        ? 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)' 
                        : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      border: msg.role === "user" ? 'none' : '1px solid #e8e8e8',
                      borderRadius: '12px',
                      boxShadow: msg.role === "user" 
                        ? '0 4px 12px rgba(24, 144, 255, 0.3)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.1)',
                      color: msg.role === "user" ? 'white' : 'inherit'
                    }}
                  >
                    <Row gutter={12} align="top">
                      <Col flex="none">
                        <Avatar 
                          size={32}
                          style={{ 
                            background: msg.role === "user" ? 'rgba(255,255,255,0.2)' : '#f0f2f5',
                            border: msg.role === "user" ? '2px solid rgba(255,255,255,0.3)' : '2px solid #e8e8e8'
                          }}
                          icon={msg.role === "user" ? 
                            <UserOutlined style={{ color: msg.role === "user" ? 'white' : '#1890ff' }} /> : 
                            <RobotOutlined style={{ color: '#1890ff' }} />
                          }
                        />
                      </Col>
                      
                      <Col flex="auto">
                        <div style={{ marginBottom: '8px' }}>
                          <Text strong style={{ 
                            color: msg.role === "user" ? 'white' : '#1890ff',
                            fontSize: '13px'
                          }}>
                            {msg.role === "user" ? '您' : 'AI 助手'}
                          </Text>
                          <Text style={{ 
                            fontSize: '11px', 
                            opacity: 0.7,
                            color: msg.role === "user" ? 'white' : '#999',
                            marginLeft: '8px'
                          }}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </Text>
                        </div>
                        
                        <Paragraph 
                          style={{ 
                            margin: 0, 
                            whiteSpace: 'pre-wrap',
                            color: msg.role === "user" ? 'white' : 'inherit',
                            lineHeight: '1.6'
                          }}
                        >
                          {msg.content}
                        </Paragraph>
                      </Col>
                    </Row>
                  </Card>
                </div>
              ))
            )}
            
            {isLoading && (
              <div style={{ width: '100%' }}>
                <Card
                  size="small"
                  style={{
                    marginRight: '15%',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '1px solid #e8e8e8',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Row gutter={12} align="top">
                    <Col flex="none">
                      <Avatar 
                        size={32}
                        style={{ 
                          background: '#f0f2f5',
                          border: '2px solid #e8e8e8'
                        }}
                        icon={<RobotOutlined style={{ color: '#1890ff' }} />}
                      />
                    </Col>
                    
                    <Col flex="auto">
                      <div style={{ marginBottom: '8px' }}>
                        <Text strong style={{ color: '#1890ff', fontSize: '13px' }}>
                          AI 助手
                        </Text>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          display: 'flex', 
                          gap: '4px',
                          alignItems: 'center'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#1890ff',
                            animation: 'pulse 1.5s ease-in-out infinite'
                          }} />
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#1890ff',
                            animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                          }} />
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#1890ff',
                            animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                          }} />
                          <Text style={{ marginLeft: '8px', color: '#666' }}>
                            正在思考...
                          </Text>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </div>
            )}
          </Space>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* 输入区域 */}
        <Card 
          size="small"
          style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid #e8e8e8',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="请输入您的问题... (Shift+Enter 换行，Enter 发送)"
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={isLoading}
              style={{ 
                resize: 'none',
                borderRadius: '8px 0 0 8px',
                border: '1px solid #d9d9d9',
                fontSize: '14px'
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              loading={isLoading}
              style={{ 
                height: 'auto',
                borderRadius: '0 8px 8px 0',
                background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                border: 'none',
                minWidth: '80px',
                fontWeight: '500'
              }}
            >
              发送
            </Button>
          </Space.Compact>
        </Card>
      </Content>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </Layout>
  );
};

export default ChatInterface;
