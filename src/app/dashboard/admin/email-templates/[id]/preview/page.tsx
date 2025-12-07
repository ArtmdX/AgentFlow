'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Eye, Code } from 'lucide-react';
import Link from 'next/link';

export default function PreviewTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [testVariables, setTestVariables] = useState({});

  const { data: template, isLoading: loadingTemplate } = useQuery({
    queryKey: ['email-template', id],
    queryFn: async () => {
      const response = await fetch(`/api/email-templates/${id}`);
      if (!response.ok) throw new Error('Failed to fetch template');
      return response.json();
    },
  });

  const { data: preview, isLoading: loadingPreview, refetch } = useQuery({
    queryKey: ['email-template-preview', id, testVariables],
    queryFn: async () => {
      const response = await fetch(`/api/email-templates/${id}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variables: testVariables }),
      });
      if (!response.ok) throw new Error('Failed to generate preview');
      return response.json();
    },
    enabled: !!template,
  });

  const handleVariableChange = (key: string, value: string) => {
    setTestVariables((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRefreshPreview = () => {
    refetch();
  };

  if (loadingTemplate) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="text-center py-12">
          <div className="text-gray-500">Carregando template...</div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="text-center py-12">
          <div className="text-red-500">Template não encontrado</div>
        </div>
      </div>
    );
  }

  const availableVars = Array.isArray(template.availableVars)
    ? template.availableVars
    : [];

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/admin/email-templates"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Templates
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Preview: {template.name}</h1>
            <p className="text-gray-600 mt-1">Visualize como o e-mail será exibido</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                viewMode === 'preview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                viewMode === 'code'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Code className="w-4 h-4" />
              Código
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Variables Sidebar */}
        {availableVars.length > 0 && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Variáveis de Teste</h3>
              <div className="space-y-4">
                {availableVars.map((varName: string) => (
                  <div key={varName}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {varName}
                    </label>
                    <input
                      type="text"
                      placeholder={`${varName}...`}
                      onChange={(e) => handleVariableChange(varName, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                ))}
                <button
                  onClick={handleRefreshPreview}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Atualizar Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Content */}
        <div className={availableVars.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Subject Line */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">Assunto:</div>
              <div className="font-medium text-gray-900">
                {loadingPreview ? 'Carregando...' : preview?.subject || template.subject}
              </div>
            </div>

            {/* Email Content */}
            <div className="p-6">
              {loadingPreview ? (
                <div className="text-center py-12 text-gray-500">Gerando preview...</div>
              ) : viewMode === 'preview' ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={preview?.html || template.htmlContent}
                    className="w-full h-[600px]"
                    title="Email Preview"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* HTML Code */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">HTML:</h4>
                    <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-xs">
                      <code>{preview?.html || template.htmlContent}</code>
                    </pre>
                  </div>

                  {/* Text Version */}
                  {(preview?.text || template.textContent) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Texto:</h4>
                      <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-xs whitespace-pre-wrap">
                        {preview?.text || template.textContent}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
