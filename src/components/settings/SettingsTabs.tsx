'use client';

/**
 * SettingsTabs Component
 * Navigation tabs for settings sections
 */

import {
  Building2,
  MapPin,
  Mail,
  DollarSign,
  Percent,
  FileText,
  Bell,
  Database,
} from 'lucide-react';

export type SettingsTab =
  | 'agency'
  | 'address'
  | 'email'
  | 'currency'
  | 'financial'
  | 'terms'
  | 'notifications'
  | 'backup';

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const tabs = [
  {
    id: 'agency' as SettingsTab,
    label: 'Agência',
    icon: Building2,
    description: 'Informações básicas',
  },
  {
    id: 'address' as SettingsTab,
    label: 'Endereço',
    icon: MapPin,
    description: 'Localização',
  },
  {
    id: 'email' as SettingsTab,
    label: 'Email',
    icon: Mail,
    description: 'Configuração SMTP',
  },
  {
    id: 'currency' as SettingsTab,
    label: 'Moeda',
    icon: DollarSign,
    description: 'Câmbio e moedas',
  },
  {
    id: 'financial' as SettingsTab,
    label: 'Financeiro',
    icon: Percent,
    description: 'Juros e multas',
  },
  {
    id: 'terms' as SettingsTab,
    label: 'Termos',
    icon: FileText,
    description: 'Políticas e termos',
  },
  {
    id: 'notifications' as SettingsTab,
    label: 'Notificações',
    icon: Bell,
    description: 'Alertas do sistema',
  },
  {
    id: 'backup' as SettingsTab,
    label: 'Backup',
    icon: Database,
    description: 'Exportar/Importar',
  },
];

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="bg-white border-b">
      <div className="overflow-x-auto">
        <div className="flex gap-2 min-w-max p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium text-sm">{tab.label}</div>
                  <div
                    className={`text-xs ${
                      isActive ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {tab.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
