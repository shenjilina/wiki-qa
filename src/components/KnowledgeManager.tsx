'use client';

import { useState } from 'react';
import type { KnowledgeItem, NewKnowledgeItem } from '@/types/index';
import { DEFAULT_CATEGORIES } from '@/types/knowledge';
import { logError, logInfo } from '@/lib/logger';

export default function KnowledgeManager() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<NewKnowledgeItem>({
    title: '',
    content: '',
    category: '技术开发',
  });

  const categories = DEFAULT_CATEGORIES;

  const addKnowledgeItem = () => {
    if (!newItem.title.trim() || !newItem.content.trim()) {
      alert('请填写完整的标题和内容');
      return;
    }

    const item: KnowledgeItem = {
      id: Date.now().toString(),
      title: newItem.title,
      content: newItem.content,
      category: newItem.category,
      createdAt: new Date().toISOString(),
    };

    setKnowledgeItems(prev => [...prev, item]);
    setNewItem({ title: '', content: '', category: '技术开发' });
    setIsAddingNew(false);

    // 保存到本地存储
    const updatedItems = [...knowledgeItems, item];
    localStorage.setItem('knowledgeItems', JSON.stringify(updatedItems));
    
    logInfo('KnowledgeManager', '添加新知识条目', { 
      id: item.id, 
      title: item.title, 
      category: item.category 
    });
  };

  const deleteKnowledgeItem = (id: string) => {
    const itemToDelete = knowledgeItems.find(item => item.id === id);
    const updatedItems = knowledgeItems.filter(item => item.id !== id);
    setKnowledgeItems(updatedItems);
    localStorage.setItem('knowledgeItems', JSON.stringify(updatedItems));
    
    logInfo('KnowledgeManager', '删除知识条目', { 
      id, 
      title: itemToDelete?.title 
    });
  };

  const exportKnowledge = () => {
    try {
      const dataStr = JSON.stringify(knowledgeItems, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'knowledge-base.json';
      link.click();
      URL.revokeObjectURL(url);
      
      logInfo('KnowledgeManager', '导出知识库', { 
        itemCount: knowledgeItems.length 
      });
    } catch (error) {
      logError('KnowledgeManager', error, { 
        action: 'export', 
        itemCount: knowledgeItems.length 
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">知识库管理</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            添加知识
          </button>
          <button
            onClick={exportKnowledge}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            导出知识库
          </button>
        </div>
      </div>

      {/* 添加新知识表单 */}
      {isAddingNew && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">添加新知识</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标题
              </label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入知识标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分类
              </label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                内容
              </label>
              <textarea
                value={newItem.content}
                onChange={(e) => setNewItem(prev => ({ ...prev, content: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="输入知识内容"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addKnowledgeItem}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                保存
              </button>
              <button
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 知识列表 */}
      <div className="space-y-4">
        {knowledgeItems.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-4">📚</div>
            <p>暂无知识条目</p>
            <p className="text-sm">点击"添加知识"开始构建您的知识库</p>
          </div>
        ) : (
          knowledgeItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{item.content}</p>
                  <p className="text-xs text-gray-400">
                    创建时间: {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteKnowledgeItem(item.id)}
                  className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {knowledgeItems.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          共 {knowledgeItems.length} 条知识
        </div>
      )}
    </div>
  );
}