'use client';

import { TemplateForm } from '@/components/email-templates/TemplateForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewTemplatePage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const response = await fetch('/api/email-templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create template');
    }

    return response.json();
  };

  const handleSuccess = () => {
    router.push('/dashboard/admin/email-templates');
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Novo Template de E-mail</h1>
        <p className="text-gray-600 mt-1">Crie um novo template de e-mail para o sistema</p>
      </div>

      {/* Form */}
      <TemplateForm onSubmit={handleSubmit} onSuccess={handleSuccess} />
    </div>
  );
}
