'use client';

import { useState } from 'react';
import { User, Bell, Mail } from 'lucide-react';
import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'email'>('notifications');

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie suas preferências e configurações da conta</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="w-4 h-4" />
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-4 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notificações
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-4 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'email'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Mail className="w-4 h-4" />
            E-mail
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Configurações de Perfil</h2>
            <p className="text-gray-600">
              Para alterar seus dados pessoais, acesse{' '}
              <a href="/dashboard/profile" className="text-blue-600 hover:underline">
                Meu Perfil
              </a>
              .
            </p>
          </div>
        )}

        {activeTab === 'notifications' && <NotificationPreferences />}

        {activeTab === 'email' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Configurações de E-mail</h2>
            <p className="text-gray-600">
              As preferências de e-mail estão disponíveis na aba de Notificações.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
