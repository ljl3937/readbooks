import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBookContent(bookInfo: any) {
  try {
    const coreContent = await generateCoreContent(bookInfo);
    const backgroundInfo = await generateBackgroundInfo(bookInfo);
    
    return {
      coreContent,
      backgroundInfo,
    };
  } catch (error) {
    console.error('AI内容生成失败:', error);
    throw error;
  }
}

async function generateCoreContent(bookInfo: any) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "你是一个专业的图书内容分析师"
      },
      {
        role: "user",
        content: `请提取《${bookInfo.title}》的核心内容要点`
      }
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
}

async function generateBackgroundInfo(bookInfo: any) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "你是一个专业的图书背景研究专家"
      },
      {
        role: "user",
        content: `请提供《${bookInfo.title}》的创作背景和相关资料`
      }
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
} 