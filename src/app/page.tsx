'use client';

import React from 'react';
import { Layout, Typography, Space, Button, Card, Row, Col } from 'antd';
import { BookOutlined, DatabaseOutlined, SettingOutlined, RobotOutlined } from '@ant-design/icons';
import Link from 'next/link';
import ChatInterface from '@/components/ChatInterface';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <Layout style={{ height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Content style={{ 
        padding: '16px', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* 头部介绍区域 - 紧凑版 */}
          <Card 
            style={{ 
              marginBottom: '16px', 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              flexShrink: 0
            }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div>
                <RobotOutlined style={{ fontSize: '36px', color: '#1890ff', marginBottom: '8px' }} />
                <Title level={2} style={{ 
                  margin: 0, 
                  background: 'linear-gradient(45deg, #1890ff, #722ed1)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  fontSize: '24px'
                }}>
                  智能知识问答系统
                </Title>
              </div>
              
              <Paragraph style={{ fontSize: '14px', color: '#666', margin: '4px 0 8px 0' }}>
                基于 Next.js + LangChain + TypeScript 构建，支持多领域知识问答
              </Paragraph>
              
              <Row gutter={[12, 12]} justify="center">
                <Col xs={8} sm={6} md={4}>
                  <Link href="/knowledge" style={{ textDecoration: 'none' }}>
                    <Button 
                      type="primary" 
                      size="small"
                      icon={<BookOutlined />}
                      style={{ 
                        width: '100%',
                        height: '32px',
                        background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                        border: 'none',
                        fontSize: '12px'
                      }}
                    >
                      知识库
                    </Button>
                  </Link>
                </Col>
                <Col xs={8} sm={6} md={4}>
                  <Link href="/memory" style={{ textDecoration: 'none' }}>
                    <Button 
                      type="primary" 
                      size="small"
                      icon={<DatabaseOutlined />}
                      style={{ 
                        width: '100%',
                        height: '32px',
                        background: 'linear-gradient(45deg, #722ed1, #b37feb)',
                        border: 'none',
                        fontSize: '12px'
                      }}
                    >
                      内存管理
                    </Button>
                  </Link>
                </Col>
                <Col xs={8} sm={6} md={4}>
                  <Link href="/test-env" style={{ textDecoration: 'none' }}>
                    <Button 
                      type="primary" 
                      size="small"
                      icon={<SettingOutlined />}
                      style={{ 
                        width: '100%',
                        height: '32px',
                        background: 'linear-gradient(45deg, #fa8c16, #ffc53d)',
                        border: 'none',
                        fontSize: '12px'
                      }}
                    >
                      测试环境
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Space>
          </Card>
          
          {/* 聊天界面区域 - 自适应高度 */}
          <Card 
            title="智能聊天界面" 
            style={{ 
              flex: 1,
              background: 'linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%)',
              border: '1px solid #e8e8e8',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0
            }}
            styles={{ 
              body: { 
                flex: 1,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0
              }
            }}
          >
            <ChatInterface />
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

export default Home;
