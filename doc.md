

# AI读书工具开发文档

## 1. 项目概述

### 1.1 项目目标
开发一个AI驱动的读书工具，通过输入书名快速生成书籍核心内容和背景资料的卡片式展示系统。

### 1.2 技术架构
```
项目架构
├── 前端层 (Next.js + Ant Design)
├── 后端服务 (Next.js API Routes)
├── AI服务层 (OpenAI API)
└── 数据存储层 (Supabase)
```

## 2. 数据库设计

### 2.1 数据表结构

```sql
-- 书籍信息表
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    published_year INTEGER,
    isbn VARCHAR(13),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 内容卡片表
CREATE TABLE content_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES books(id),
    card_type VARCHAR(50), -- 'core_content', 'background', 'summary'
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 用户收藏表
CREATE TABLE user_favorites (
    user_id UUID REFERENCES auth.users(id),
    book_id UUID REFERENCES books(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, book_id)
);
```

## 3. API 设计

### 3.1 接口定义

```typescript
// 书籍相关接口
interface BookAPI {
  // 搜索书籍
  GET /api/books/search?query={bookName}
  
  // 获取书籍详情
  GET /api/books/{bookId}
  
  // 生成书籍内容卡片
  POST /api/books/{bookId}/generate-cards
  
  // 获取书籍卡片列表
  GET /api/books/{bookId}/cards
}

// 用户相关接口
interface UserAPI {
  // 收藏书籍
  POST /api/favorites/add
  
  // 获取收藏列表
  GET /api/favorites
}
```

## 4. 页面路由设计

```
页面结构
├── / (首页)
├── /search (搜索结果页)
├── /books/[id] (书籍详情页)
└── /favorites (收藏页面)
```

## 5. AI 处理流程

### 5.1 内容生成流程
```typescript
async function generateBookContent(bookInfo: BookInfo) {
  // 1. 提取核心内容
  const coreContent = await generateCoreContent(bookInfo);
  
  // 2. 生成背景资料
  const backgroundInfo = await generateBackgroundInfo(bookInfo);
  
  // 3. 创建内容卡片
  await createContentCards({
    bookId: bookInfo.id,
    coreContent,
    backgroundInfo
  });
}
```

## 6. 开发计划

### 6.1 Phase 1 - MVP开发 (2周)
- 基础项目搭建
- 数据库设计和实现
- 基础搜索功能
- AI内容生成基础实现

### 6.2 Phase 2 - 功能完善 (2周)
- UI/UX优化
- 用户系统集成
- 收藏功能实现
- 内容展示优化

### 6.3 Phase 3 - 优化和测试 (1周)
- 性能优化
- 错误处理
- 用户测试
- Bug修复

## 7. 环境配置

### 7.1 环境变量
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
```

### 7.2 依赖安装
```bash
npm install @supabase/supabase-js antd openai
```

## 8. 部署说明

### 8.1 部署步骤
1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

### 8.2 监控和维护
- 使用 Vercel Analytics 监控性能
- 设置错误告警
- 定期数据备份

## 9. 注意事项

### 9.1 安全考虑
- API 调用限制
- 用户认证
- 数据加密
- 内容审核

### 9.2 性能优化
- 实现请求缓存
- 图片优化
- API 响应优化
- 数据库查询优化
