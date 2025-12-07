'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, Code, Plus, X } from 'lucide-react';

interface TemplateFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<any>;
  onSuccess: () => void;
  isEdit?: boolean;
}

export function TemplateForm({ initialData, onSubmit, onSuccess, isEdit = false }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    description: '',
    subject: '',
    htmlContent: '',
    textContent: '',
    availableVars: [] as string[],
    isActive: true,
  });

  const [newVariable, setNewVariable] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || '',
        name: initialData.name || '',
        description: initialData.description || '',
        subject: initialData.subject || '',
        htmlContent: initialData.htmlContent || '',
        textContent: initialData.textContent || '',
        availableVars: Array.isArray(initialData.availableVars) ? initialData.availableVars : [],
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddVariable = () => {
    if (newVariable.trim() && !formData.availableVars.includes(newVariable.trim())) {
      setFormData((prev) => ({
        ...prev,
        availableVars: [...prev.availableVars, newVariable.trim()],
      }));
      setNewVariable('');
    }
  };

  const handleRemoveVariable = (varName: string) => {
    setFormData((prev) => ({
      ...prev,
      availableVars: prev.availableVars.filter((v) => v !== varName),
    }));
  };

  const handleInsertVariable = (varName: string) => {
    const variable = `{${varName}}`;
    // Insert into subject or HTML depending on active textarea
    // For now, just copy to clipboard
    navigator.clipboard.writeText(variable);
    alert(`Variável ${variable} copiada para área de transferência!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await onSubmit(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar template');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Template Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo do Template <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              placeholder="ex: travel_created"
              disabled={isEdit}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Identificador único (não pode ser alterado)
            </p>
          </div>

          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="ex: Viagem Criada"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Descrição do template..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Active Status */}
        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Template ativo</span>
          </label>
        </div>
      </div>

      {/* Variables */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Variáveis Disponíveis</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newVariable}
            onChange={(e) => setNewVariable(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVariable())}
            placeholder="Nome da variável (ex: customerName)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddVariable}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>

        {formData.availableVars.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {formData.availableVars.map((varName) => (
              <div
                key={varName}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
              >
                <button
                  type="button"
                  onClick={() => handleInsertVariable(varName)}
                  className="hover:underline"
                  title="Copiar variável"
                >
                  {`{${varName}}`}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveVariable(varName)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                  title="Remover"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhuma variável adicionada ainda</p>
        )}
      </div>

      {/* Subject */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Assunto do E-mail</h2>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          placeholder="ex: Nova viagem criada - {customerName}"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use {'{'}variável{'}'} para inserir valores dinâmicos
        </p>
      </div>

      {/* HTML Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Conteúdo HTML</h2>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            {showPreview ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Editar' : 'Preview'}
          </button>
        </div>

        {showPreview ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              srcDoc={formData.htmlContent}
              className="w-full h-96"
              title="HTML Preview"
            />
          </div>
        ) : (
          <textarea
            value={formData.htmlContent}
            onChange={(e) => handleChange('htmlContent', e.target.value)}
            placeholder="Cole ou escreva o HTML do e-mail aqui..."
            rows={12}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        )}
      </div>

      {/* Text Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Conteúdo em Texto Puro (Opcional)
        </h2>
        <textarea
          value={formData.textContent}
          onChange={(e) => handleChange('textContent', e.target.value)}
          placeholder="Versão em texto puro do e-mail (para clientes que não suportam HTML)..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Salvando...' : isEdit ? 'Atualizar Template' : 'Criar Template'}
        </button>
      </div>
    </form>
  );
}
