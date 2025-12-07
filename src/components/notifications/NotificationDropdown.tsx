'use client';

import { useState } from 'react';
import { CheckCheck, Trash2, Settings } from 'lucide-react';
import { useNotifications, useMarkAllAsRead, useClearAllRead } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { NotificationEmpty } from './NotificationEmpty';
import { useRouter } from 'next/navigation';

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const router = useRouter();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const { data, isLoading } = useNotifications({ limit: 10, unreadOnly });
  const markAllAsRead = useMarkAllAsRead();
  const clearAllRead = useClearAllRead();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
  };

  const handleClearAllRead = async () => {
    await clearAllRead.mutateAsync();
  };

  const handleOpenSettings = () => {
    router.push('/dashboard/settings');
    onClose();
  };

  const notifications = data?.notifications || [];
  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Notificações</h3>

          <button
            onClick={handleOpenSettings}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            aria-label="Configurações de notificações"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setUnreadOnly(false)}
            className={`px-3 py-1 rounded ${
              !unreadOnly
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setUnreadOnly(true)}
            className={`px-3 py-1 rounded ${
              unreadOnly
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Não lidas
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Carregando...
          </div>
        ) : notifications.length === 0 ? (
          <NotificationEmpty />
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex gap-2">
          {hasUnread && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4" />
              Marcar todas como lidas
            </button>
          )}

          <button
            onClick={handleClearAllRead}
            disabled={clearAllRead.isPending}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Limpar lidas
          </button>
        </div>
      )}
    </div>
  );
}
