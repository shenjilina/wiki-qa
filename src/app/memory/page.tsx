'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Statistic, 
  Button, 
  List, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Divider,
  Tag,
  Modal,
  message,
  Spin,
  Empty,
  Tooltip,
  Alert
} from 'antd';
import { 
  DeleteOutlined, 
  ReloadOutlined, 
  HistoryOutlined,
  MessageOutlined,
  UserOutlined,
  RobotOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  HomeOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { logInfo, logError } from '@/lib/logger';

const { Content, Header } = Layout;
const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

interface MemoryStats {
  totalSessions: number;
  totalRecords: number;
  averageRecordsPerSession: number;
}

interface ConversationRecord {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

interface SessionInfo {
  sessionId: string;
  recordCount: number;
  lastActivity: string;
}

export default function MemoryPage() {
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<ConversationRecord[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // 获取内存统计
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/memory?type=stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        logInfo('MemoryPage', '获取内存统计成功', data);
      } else {
        throw new Error('获取统计失败');
      }
    } catch (error) {
      logError('MemoryPage', '获取内存统计失败', error);
      message.error('获取内存统计失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取所有会话
  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/memory?type=sessions');
      if (response.ok) {
        const sessionIds = await response.json();
        
        // 为每个会话获取详细信息
        const sessionInfos: SessionInfo[] = [];
        for (const sessionId of sessionIds) {
          try {
            const historyResponse = await fetch(`/api/memory?sessionId=${sessionId}`);
            if (historyResponse.ok) {
              const history = await historyResponse.json();
              sessionInfos.push({
                sessionId,
                recordCount: history.length,
                lastActivity: history.length > 0 ? history[history.length - 1].timestamp : '无记录'
              });
            }
          } catch (error) {
            logError('MemoryPage', `获取会话 ${sessionId} 信息失败`, error);
          }
        }
        
        setSessions(sessionInfos);
        logInfo('MemoryPage', '获取会话列表成功', { count: sessionInfos.length });
      } else {
        throw new Error('获取会话列表失败');
      }
    } catch (error) {
      logError('MemoryPage', '获取会话列表失败', error);
      message.error('获取会话列表失败');
    }
  };

  // 获取会话历史
  const fetchHistory = async (sessionId: string) => {
    try {
      setHistoryLoading(true);
      const response = await fetch(`/api/memory?sessionId=${sessionId}`);
      if (response.ok) {
        const history = await response.json();
        setSelectedHistory(history);
        setSelectedSessionId(sessionId);
        logInfo('MemoryPage', '获取会话历史成功', { sessionId, count: history.length });
      } else {
        throw new Error('获取会话历史失败');
      }
    } catch (error) {
      logError('MemoryPage', '获取会话历史失败', error);
      message.error('获取会话历史失败');
    } finally {
      setHistoryLoading(false);
    }
  };

  // 清除所有会话
  const clearAllSessions = () => {
    confirm({
      title: '确认清除所有会话',
      icon: <ExclamationCircleOutlined />,
      content: '此操作将删除所有会话记录，无法恢复。确定要继续吗？',
      okText: '确定',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await fetch('/api/memory', { method: 'DELETE' });
          if (response.ok) {
            message.success('所有会话已清除');
            setStats(null);
            setSessions([]);
            setSelectedHistory([]);
            setSelectedSessionId(null);
            await fetchStats();
            logInfo('MemoryPage', '清除所有会话成功');
          } else {
            throw new Error('清除失败');
          }
        } catch (error) {
          logError('MemoryPage', '清除所有会话失败', error);
          message.error('清除所有会话失败');
        }
      },
    });
  };

  // 清除单个会话
  const clearSession = (sessionId: string) => {
    confirm({
      title: '确认清除会话',
      icon: <ExclamationCircleOutlined />,
      content: `确定要清除会话 ${sessionId} 的所有记录吗？此操作无法恢复。`,
      okText: '确定',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await fetch(`/api/memory?sessionId=${sessionId}`, { 
            method: 'DELETE' 
          });
          if (response.ok) {
            message.success(`会话 ${sessionId} 已清除`);
            await Promise.all([fetchStats(), fetchSessions()]);
            if (selectedSessionId === sessionId) {
              setSelectedHistory([]);
              setSelectedSessionId(null);
            }
            logInfo('MemoryPage', '清除单个会话成功', { sessionId });
          } else {
            throw new Error('清除失败');
          }
        } catch (error) {
          logError('MemoryPage', '清除单个会话失败', error);
          message.error('清除会话失败');
        }
      },
    });
  };

  // 刷新所有数据
  const refreshAll = async () => {
    await Promise.all([fetchStats(), fetchSessions()]);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Header style={{
        background: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            <HistoryOutlined style={{ marginRight: 8 }} />
            内存管理
          </Title>
          <Link href="/">
            <Button type="text" icon={<HomeOutlined />} style={{ color: 'white' }}>
              返回首页
            </Button>
          </Link>
        </div>
      </Header>

      <Content style={{ padding: '24px', background: 'transparent' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* 统计信息 */}
          <Card 
            title={
              <Space>
                <MessageOutlined />
                <span>内存统计</span>
              </Space>
            }
            extra={
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={refreshAll}
                loading={loading}
              >
                刷新
              </Button>
            }
            style={{ 
              marginBottom: 24,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
              </div>
            ) : stats ? (
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="总会话数"
                    value={stats.totalSessions}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="总记录数"
                    value={stats.totalRecords}
                    prefix={<MessageOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="平均记录数"
                    value={stats.averageRecordsPerSession}
                    precision={1}
                    prefix={<RobotOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Col>
              </Row>
            ) : (
              <Empty description="暂无统计数据" />
            )}
          </Card>

          <Row gutter={24}>
            {/* 会话列表 */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <UserOutlined />
                    <span>会话列表</span>
                    <Tag color="blue">{sessions.length} 个会话</Tag>
                  </Space>
                }
                extra={
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={clearAllSessions}
                    disabled={sessions.length === 0}
                  >
                    清除所有
                  </Button>
                }
                style={{ 
                  height: 600,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
                bodyStyle={{ height: 'calc(100% - 57px)', overflow: 'auto' }}
              >
                {sessions.length === 0 ? (
                  <Empty description="暂无会话记录" />
                ) : (
                  <List
                    dataSource={sessions}
                    renderItem={(session) => (
                      <List.Item
                        actions={[
                          <Tooltip title="查看历史">
                            <Button
                              type="text"
                              icon={<HistoryOutlined />}
                              onClick={() => fetchHistory(session.sessionId)}
                              loading={historyLoading && selectedSessionId === session.sessionId}
                            />
                          </Tooltip>,
                          <Tooltip title="删除会话">
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => clearSession(session.sessionId)}
                            />
                          </Tooltip>
                        ]}
                        style={{
                          background: selectedSessionId === session.sessionId ? '#f0f8ff' : 'transparent',
                          borderRadius: 8,
                          margin: '4px 0',
                          padding: '8px 12px'
                        }}
                      >
                        <List.Item.Meta
                          title={
                            <Space>
                              <Text strong>{session.sessionId}</Text>
                              <Tag color="green">{session.recordCount} 条记录</Tag>
                            </Space>
                          }
                          description={
                            <Space>
                              <ClockCircleOutlined />
                              <Text type="secondary">
                                最后活动: {session.lastActivity === '无记录' ? '无记录' : new Date(session.lastActivity).toLocaleString()}
                              </Text>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Col>

            {/* 会话历史 */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <HistoryOutlined />
                    <span>会话历史</span>
                    {selectedSessionId && <Tag color="purple">{selectedSessionId}</Tag>}
                  </Space>
                }
                style={{ 
                  height: 600,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
                bodyStyle={{ height: 'calc(100% - 57px)', overflow: 'auto' }}
              >
                {!selectedSessionId ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Empty 
                      description="请选择一个会话查看历史记录"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </div>
                ) : historyLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                  </div>
                ) : selectedHistory.length === 0 ? (
                  <Empty description="该会话暂无历史记录" />
                ) : (
                  <List
                    dataSource={selectedHistory}
                    renderItem={(record, index) => (
                      <List.Item style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                        <Card 
                          size="small" 
                          style={{ 
                            width: '100%', 
                            marginBottom: 8,
                            background: '#f8f9fa',
                            border: '1px solid #e9ecef'
                          }}
                        >
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                              <Tag color="blue" icon={<UserOutlined />}>问题 #{index + 1}</Tag>
                              <Text type="secondary" style={{ float: 'right' }}>
                                <ClockCircleOutlined /> {new Date(record.timestamp).toLocaleString()}
                              </Text>
                            </div>
                            <Paragraph style={{ margin: 0, background: 'white', padding: 8, borderRadius: 4 }}>
                              {record.question}
                            </Paragraph>
                            <Divider style={{ margin: '8px 0' }} />
                            <div>
                              <Tag color="green" icon={<RobotOutlined />}>回答</Tag>
                            </div>
                            <Paragraph style={{ margin: 0, background: 'white', padding: 8, borderRadius: 4 }}>
                              {record.answer}
                            </Paragraph>
                          </Space>
                        </Card>
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Col>
          </Row>

          {/* 使用说明 */}
          <Card 
            style={{ 
              marginTop: 24,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Alert
              message="使用说明"
              description={
                <div>
                  <p>• <strong>内存统计</strong>：显示系统中所有会话的统计信息</p>
                  <p>• <strong>会话列表</strong>：显示所有活跃会话，点击历史图标查看详细记录</p>
                  <p>• <strong>会话历史</strong>：显示选中会话的所有问答记录</p>
                  <p>• <strong>清除功能</strong>：可以清除单个会话或所有会话的记录</p>
                </div>
              }
              type="info"
              showIcon
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
}