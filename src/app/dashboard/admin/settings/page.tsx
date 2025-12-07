'use client';

/**
 * Settings Page
 * Admin-only page for agency settings management
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { hasPermission, Permission } from '@/lib/permissions';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import SettingsTabs, { SettingsTab } from '@/components/settings/SettingsTabs';
import AgencyInfoForm from '@/components/settings/AgencyInfoForm';
import AddressForm from '@/components/settings/AddressForm';
import EmailSettingsForm from '@/components/settings/EmailSettingsForm';
import CurrencySettingsForm from '@/components/settings/CurrencySettingsForm';
import FinancialSettingsForm from '@/components/settings/FinancialSettingsForm';
import TermsSettingsForm from '@/components/settings/TermsSettingsForm';
import NotificationSettingsForm from '@/components/settings/NotificationSettingsForm';
import SettingsBackup from '@/components/settings/SettingsBackup';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('agency');
  const [formData, setFormData] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data: settings, isLoading, error } = useSettings();
  const updateSettings = useUpdateSettings();

  // Check permissions
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (!hasPermission(session as any, Permission.MANAGE_SETTINGS)) {
      router.push('/dashboard');
      return;
    }
  }, [status, session, router]);

  // Load settings into form
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(formData);
      setHasChanges(false);
      alert('Configurações salvas com sucesso!');
    } catch (error: any) {
      alert('Erro ao salvar configurações: ' + error.message);
    }
  };

  const handleCancel = () => {
    if (!hasChanges || confirm('Descartar alterações não salvas?')) {
      setFormData(settings || {});
      setHasChanges(false);
    }
  };

  // Loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Erro ao carregar configurações
          </h2>
          <p className="text-gray-600">{(error as any).message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Configurações da Agência
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Gerencie as configurações globais do sistema
              </p>
            </div>

            {/* Save/Cancel Buttons */}
            {activeTab !== 'backup' && (
              <div className="flex items-center gap-3">
                {hasChanges && (
                  <span className="text-sm text-orange-600 font-medium">
                    Alterações não salvas
                  </span>
                )}
                <button
                  onClick={handleCancel}
                  disabled={!hasChanges}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || updateSettings.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {updateSettings.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {activeTab === 'agency' && (
            <AgencyInfoForm data={formData} onChange={handleFieldChange} />
          )}
          {activeTab === 'address' && (
            <AddressForm data={formData} onChange={handleFieldChange} />
          )}
          {activeTab === 'email' && (
            <EmailSettingsForm data={formData} onChange={handleFieldChange} />
          )}
          {activeTab === 'currency' && (
            <CurrencySettingsForm data={formData} onChange={handleFieldChange} />
          )}
          {activeTab === 'financial' && (
            <FinancialSettingsForm data={formData} onChange={handleFieldChange} />
          )}
          {activeTab === 'terms' && (
            <TermsSettingsForm data={formData} onChange={handleFieldChange} />
          )}
          {activeTab === 'notifications' && (
            <NotificationSettingsForm data={formData} onChange={handleFieldChange} />
          )}
          {activeTab === 'backup' && <SettingsBackup />}
        </div>
      </div>
    </div>
  );
}
