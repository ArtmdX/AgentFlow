'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TemplateForm } from '@/components/email-templates/TemplateForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const { data: template, isLoading } = useQuery({
    queryKey: ['email-template', id],
    queryFn: async () => {
      const response = await fetch(`/api/email-templates/${id}`);
      if (!response.ok) throw new Error('Failed to fetch template');
      return response.json();
    },
  });

  const handleSubmit = async (data: any) => {
    const response = await fetch(`/api/email-templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update template');
    }

    return response.json();
  };

  const handleSuccess = () => {
    router.push('/dashboard/admin/email-templates');
  };

  if (isLoading) {
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
        <h1 className="text-3xl font-bold text-gray-900">Editar Template</h1>
        <p className="text-gray-600 mt-1">{template.name}</p>
      </div>

      {/* Form */}
      <TemplateForm
        initialData={template}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        isEdit
      />
    </div>
  );
}
