'use client';

import { useState } from 'react';
import type { TestEnvResponse } from '@/types/api';

export default function TestEnvPage() {
  const [testResult, setTestResult] = useState<TestEnvResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const testEnvironment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-env', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data: TestEnvResponse = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ 
        status: 'error',
        error: '测试失败', 
        details: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">环境变量测试</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <button
            onClick={testEnvironment}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? '测试中...' : '测试环境变量'}
          </button>
          
          {testResult && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">测试结果：</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">配置说明：</h4>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>确保项目根目录存在 <code>.env.local</code> 文件</li>
              <li>在文件中添加：<code>OPENAI_API_KEY=your_actual_api_key</code></li>
              <li>重启开发服务器：<code>pnpm dev</code></li>
              <li>点击上方按钮测试环境变量是否正确加载</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}