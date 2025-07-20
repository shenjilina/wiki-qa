# 智能知识问答系统

基于 Next.js + LangChain + TypeScript 构建的智能知识问答系统，支持多领域知识问答和自定义知识库管理。

## 🚀 功能特性

- **智能问答**: 基于 OpenAI GPT 模型的智能问答功能
- **多领域支持**: 涵盖技术开发、人工智能、商业管理、科学知识、生活常识等多个领域
- **知识库管理**: 支持添加、编辑、删除和导出自定义知识
- **实时对话**: 流畅的聊天界面，支持实时问答交互
- **响应式设计**: 适配各种设备屏幕尺寸
- **TypeScript**: 完整的类型安全支持

## 🛠️ 技术栈

- **前端框架**: Next.js 15
- **UI 框架**: Tailwind CSS
- **AI 集成**: LangChain + OpenAI
- **开发语言**: TypeScript
- **包管理器**: pnpm

## 📦 安装和运行

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd wiki-qa
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

复制 `.env.example` 文件为 `.env.local`:

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，添加您的 OpenAI API Key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

> 💡 **获取 OpenAI API Key**: 访问 [OpenAI Platform](https://platform.openai.com/api-keys) 创建您的 API Key

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🎯 使用指南

### 基本问答

1. 在主页面的聊天界面中输入您的问题
2. 点击"发送"按钮或按 Enter 键提交问题
3. 系统将基于内置知识库和 AI 模型为您提供答案

### 知识库管理

1. 点击主页面的"📚 管理知识库"按钮
2. 在知识库管理页面中：
   - **添加知识**: 点击"添加知识"按钮，填写标题、分类和内容
   - **删除知识**: 点击知识条目右侧的"删除"按钮
   - **导出知识库**: 点击"导出知识库"按钮下载 JSON 格式的知识库文件

### 支持的知识分类

- **技术开发**: 前端、后端、数据库、云计算等
- **人工智能**: 机器学习、深度学习、自然语言处理等
- **商业管理**: 项目管理、产品设计、市场营销等
- **科学知识**: 物理、化学、生物、数学等
- **生活常识**: 健康、教育、文化、历史等
- **其他**: 自定义分类

## 🏗️ 项目结构

```
wiki-qa/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts          # 聊天 API 路由
│   │   ├── knowledge/
│   │   │   └── page.tsx              # 知识库管理页面
│   │   ├── layout.tsx                # 根布局
│   │   └── page.tsx                  # 主页面
│   └── components/
│       ├── ChatInterface.tsx         # 聊天界面组件
│       └── KnowledgeManager.tsx      # 知识库管理组件
├── public/                           # 静态资源
├── .env.example                      # 环境变量示例
├── package.json                      # 项目配置
└── README.md                         # 项目说明
```

## 🔧 自定义配置

### 修改 AI 模型

在 `src/app/api/chat/route.ts` 中修改模型配置:

```typescript
const model = new ChatOpenAI({
  openAIApiKey: apiKey,
  modelName: 'gpt-4', // 修改为其他模型
  temperature: 0.7,   // 调整创造性参数
});
```

### 扩展知识库

您可以通过以下方式扩展知识库：

1. **修改内置知识库**: 编辑 `src/app/api/chat/route.ts` 中的 `knowledgeBase` 变量
2. **添加自定义知识**: 使用知识库管理界面添加特定领域的知识
3. **集成外部数据源**: 修改 API 路由以支持数据库或其他数据源

## 🚀 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 在 Vercel 项目设置中添加环境变量 `OPENAI_API_KEY`
4. 部署完成

### 其他平台

项目支持部署到任何支持 Node.js 的平台，如：
- Netlify
- Railway
- Heroku
- 自托管服务器

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

MIT License

## 🙋‍♂️ 支持

如果您在使用过程中遇到问题，请：

1. 查看本 README 文件
2. 检查环境变量配置
3. 确认 OpenAI API Key 有效
4. 提交 Issue 描述问题

---

**享受智能问答的乐趣！** 🎉
