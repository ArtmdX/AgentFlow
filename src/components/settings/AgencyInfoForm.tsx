'use client';

/**
 * AgencyInfoForm Component
 * Form for agency basic information (name, logo, contact)
 */

import { useState, useRef, ChangeEvent } from 'react';
import { Building2, Upload, X } from 'lucide-react';
import { useUploadLogo } from '@/hooks/useSettings';

interface AgencyInfoFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

export default function AgencyInfoForm({ data, onChange }: AgencyInfoFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(data.logoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadLogo = useUploadLogo();

  const handleLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Tipo de arquivo inválido. Apenas PNG, JPG e SVG são permitidos.');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Arquivo muito grande. Tamanho máximo: 2MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setLogoPreview(base64);

      try {
        const result = await uploadLogo.mutateAsync({
          file: base64,
          filename: file.name,
        });
        onChange('logoUrl', result.logoUrl);
      } catch (error: any) {
        alert(error.message || 'Erro ao fazer upload do logo');
        setLogoPreview(data.logoUrl || null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    onChange('logoUrl', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Building2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Informações da Agência</h3>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo da Agência
        </label>
        <div className="flex items-start gap-4">
          {/* Preview */}
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 relative">
            {logoPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="max-w-full max-h-full object-contain p-2"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {/* Upload Button */}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={handleLogoChange}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              Escolher Arquivo
            </label>
            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG ou SVG. Máximo 2MB.
            </p>
            {uploadLogo.isPending && (
              <p className="text-sm text-blue-600 mt-1">Carregando...</p>
            )}
          </div>
        </div>
      </div>

      {/* Agency Name */}
      <div>
        <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 mb-2">
          Nome da Agência <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="agencyName"
          value={data.agencyName || ''}
          onChange={(e) => onChange('agencyName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Ex: AgentFlow Turismo"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Telefone
        </label>
        <input
          type="tel"
          id="phone"
          value={data.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="(11) 98765-4321"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={data.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="contato@agencia.com"
        />
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
          Website
        </label>
        <input
          type="url"
          id="website"
          value={data.website || ''}
          onChange={(e) => onChange('website', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="https://www.agencia.com"
        />
      </div>
    </div>
  );
}
