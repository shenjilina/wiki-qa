import KnowledgeManager from '@/components/KnowledgeManager';

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            知识库管理
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            管理您的自定义知识库
          </p>
          <p className="text-sm text-gray-500">
            添加、编辑和组织您的知识内容，提升问答系统的准确性
          </p>
        </div>
        
        <KnowledgeManager />
        
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            ← 返回问答系统
          </a>
        </div>
      </div>
    </div>
  );
}