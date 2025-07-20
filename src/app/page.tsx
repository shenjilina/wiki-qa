import { Layout, Typography, Space, Button, Card, Row, Col } from 'antd';
import { BookOutlined, DatabaseOutlined, SettingOutlined, RobotOutlined } from '@ant-design/icons';
import Link from 'next/link';
import ChatInterface from '@/components/ChatInterface';
console.log(Layout)
const { Content } = Layout;
debugger;
const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* 头部介绍区域 */}
          <Card 
            style={{ 
              marginBottom: '24px', 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: 'none'
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <RobotOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                <Title level={1} style={{ margin: 0, background: 'linear-gradient(45deg, #1890ff, #722ed1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  智能知识问答系统
                </Title>
              </div>
              
              <div>
                <Paragraph style={{ fontSize: '18px', color: '#666', margin: '8px 0' }}>
                  基于 Next.js + LangChain + TypeScript 构建
                </Paragraph>
                <Paragraph style={{ fontSize: '14px', color: '#999', margin: 0 }}>
                  支持多领域知识问答，流式输出，为您提供准确、有用的信息
                </Paragraph>
              </div>
              
              {/* 功能按钮组 */}
              <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={8} md={6}>
                  <Link href="/knowledge" style={{ textDecoration: 'none' }}>
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<BookOutlined />}
                      style={{ 
                        width: '100%',
                        height: '48px',
                        background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)'
                      }}
                    >
                      管理知识库
                    </Button>
                  </Link>
                </Col>
                <Col xs={24} sm={8} md={6}>
                  <Link href="/memory" style={{ textDecoration: 'none' }}>
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<DatabaseOutlined />}
                      style={{ 
                        width: '100%',
                        height: '48px',
                        background: 'linear-gradient(45deg, #722ed1, #b37feb)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(114, 46, 209, 0.3)'
                      }}
                    >
                      内存管理
                    </Button>
                  </Link>
                </Col>
                <Col xs={24} sm={8} md={6}>
                  <Link href="/test-env" style={{ textDecoration: 'none' }}>
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<SettingOutlined />}
                      style={{ 
                        width: '100%',
                        height: '48px',
                        background: 'linear-gradient(45deg, #fa8c16, #ffc53d)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(250, 140, 22, 0.3)'
                      }}
                    >
                      测试环境配置
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Space>
          </Card>
          
          {/* 聊天界面区域 */}
          <Card 
            title="智能聊天界面" 
            style={{ 
              height: '600px',
              background: 'linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%)',
              border: '1px solid #e8e8e8',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}
            bodyStyle={{ 
              height: 'calc(100% - 57px)', 
              padding: '16px',
              display: 'flex',
              flexDirection: 'column'
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
