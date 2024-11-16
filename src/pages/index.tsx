import { Layout, Typography, Input, List, Card, message, Tabs } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Book } from '@/types';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);

  const onSearch = async (value: string) => {
    if (!value.trim()) {
      message.warning('请输入书名');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/books/search?query=${encodeURIComponent(value)}`);
      if (!response.ok) throw new Error('搜索失败');
      
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      message.error('搜索出错，请稍后重试');
      console.error('搜索错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };

  return (
    <Layout>
      <Header style={{ background: '#fff', padding: '0 50px' }}>
        <Title level={3}>AI读书助手</Title>
      </Header>
      <Content style={{ padding: '50px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Search
            placeholder="输入书名，让AI为您解读..."
            allowClear
            enterButton="解读"
            size="large"
            onSearch={onSearch}
            loading={loading}
            style={{ marginBottom: 24 }}
          />

          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={books}
            loading={loading}
            renderItem={(book) => (
              <List.Item>
                <Card 
                  hoverable
                  title={book.title}
                >
                  <p><strong>作者:</strong> {book.author}</p>
                  <p><strong>出版年份:</strong> {book.published_year}</p>
                  
                  <Tabs defaultActiveKey="summary">
                    <TabPane tab="内容简介" key="summary">
                      <Paragraph>{book.summary}</Paragraph>
                    </TabPane>
                    <TabPane tab="主要内容" key="main">
                      <Paragraph>{book.main_content}</Paragraph>
                    </TabPane>
                    <TabPane tab="心得体会" key="insights">
                      <Paragraph>{book.insights}</Paragraph>
                    </TabPane>
                    <TabPane tab="金句收录" key="quotes">
                      <List
                        dataSource={book.quotes}
                        renderItem={(quote, index) => (
                          <List.Item>
                            {index + 1}. {quote}
                          </List.Item>
                        )}
                      />
                    </TabPane>
                  </Tabs>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </Content>
    </Layout>
  );
} 