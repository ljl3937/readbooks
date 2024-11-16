import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Layout, Card, Spin } from 'antd';
import { Book, ContentCard } from '@/types';

export default function BookDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState<Book | null>(null);
  const [cards, setCards] = useState<ContentCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // TODO: 获取书籍详情和卡片数据
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <Spin />;
  }

  return (
    <Layout>
      <Layout.Content style={{ padding: '50px' }}>
        {book && (
          <Card title={book.title}>
            <p>作者: {book.author}</p>
            <p>出版年份: {book.published_year}</p>
          </Card>
        )}
      </Layout.Content>
    </Layout>
  );
} 