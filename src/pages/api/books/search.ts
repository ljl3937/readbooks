import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '方法不允许' });
  }

  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: '请提供有效的书名' });
  }

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZHIPU_API_KEY}`
      },
      body: JSON.stringify({
        model: "glm-4-flash",
        messages: [
          {
            role: "system",
            content: "你是一个专业的图书分析专家。请严格按照JSON格式返回信息，不要包含任何其他文字。"
          },
          {
            role: "user",
            content: `分析《${query}》这本书，返回格式如下：
{
  "title": "书名",
  "author": "作者",
  "published_year": 出版年份数字,
  "summary": "300字以内的内容简介",
  "main_content": "1000字以内的主要内容梳理",
  "insights": "500字以内的心得体会",
  "quotes": ["金句1", "金句2", "金句3"] 
}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API响应错误:', errorData);
      throw new Error(`API调用失败: ${response.status}`);
    }

    const result = await response.json();
    console.log('API返回结果:', result);

    if (!result.choices?.[0]?.message?.content) {
      throw new Error('AI 返回内容为空');
    }

    const content = result.choices[0].message.content.trim();
    console.log('AI返回内容:', content);
    
    const jsonStr = content.replace(/```json\s*|\s*```/g, '').trim();
    
    let bookInfo;
    try {
      bookInfo = JSON.parse(jsonStr);
    } catch (e) {
      console.error('JSON解析失败, 原始内容:', jsonStr);
      throw new Error('AI 返回格式错误');
    }

    // 验证必要字段
    if (!bookInfo.title || !bookInfo.author || !bookInfo.summary) {
      throw new Error('返回数据缺少必要字段');
    }

    // 确保 published_year 是数字
    if (bookInfo.published_year) {
      bookInfo.published_year = parseInt(bookInfo.published_year, 10);
    }

    // 确保 quotes 是数组
    if (!Array.isArray(bookInfo.quotes)) {
      bookInfo.quotes = [];
    }

    // 添加 id 字段
    const responseData = {
      ...bookInfo,
      id: uuidv4(),
    };

    return res.status(200).json([responseData]);
  } catch (error) {
    console.error('搜索错误:', error);
    return res.status(500).json({ 
      message: '搜索失败，请稍后重试',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
} 