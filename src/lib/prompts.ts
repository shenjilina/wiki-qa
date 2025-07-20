import { PromptTemplate } from "@langchain/core/prompts";

/**
 * 知识库模板内容
 */
export const KNOWLEDGE_BASE = `
你是一个专业的知识问答助手。你拥有以下知识领域的专业知识：

1. 技术开发：包括前端、后端、数据库、云计算等
2. 人工智能：机器学习、深度学习、自然语言处理等
3. 商业管理：项目管理、产品设计、市场营销等
4. 科学知识：物理、化学、生物、数学等
5. 生活常识：健康、教育、文化、历史等

请基于你的知识回答用户的问题，如果不确定答案，请诚实地说明。
`;

/**
 * 问答模板字符串
 */
export const QA_TEMPLATE = `
基于以下知识库信息回答用户问题：

知识库：
{knowledge}

用户问题：{question}

请提供准确、有用的回答：
`;

/**
 * 创建问答提示模板
 */
export const createQAPrompt = () => {
  return PromptTemplate.fromTemplate(QA_TEMPLATE);
};

/**
 * 流式输出的问答模板
 */
export const STREAMING_QA_TEMPLATE = `
基于以下知识库信息回答用户问题，请以流式方式逐步输出回答：

知识库：
{knowledge}

用户问题：{question}

请提供准确、有用的回答：
`;

/**
 * 创建流式问答提示模板
 */
export const createStreamingQAPrompt = () => {
  return PromptTemplate.fromTemplate(STREAMING_QA_TEMPLATE);
};