'use client';

import { useState, useCallback, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useUnreadCount } from '@/hooks/useNotifications';
import { useNotificationStream } from '@/hooks/useNotificationStream';
import { useQueryClient } from '@tanstack/react-query';
import type { Notification } from '@prisma/client';
import { NotificationDropdown } from './NotificationDropdown';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: unreadData } = useUnreadCount();
  const queryClient = useQueryClient();

  // Handle new notifications from SSE
  const handleNewNotification = useCallback((notification: Notification) => {
    // Invalidate unread count to refetch
    queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    queryClient.invalidateQueries({ queryKey: ['notifications'] });

    // Show browser notification if permitted
    if (typeof window !== 'undefined' && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
      });
    }
  }, [queryClient]);

  // Connect to SSE stream
  const { isConnected } = useNotificationStream(handleNewNotification);

  // Request browser notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const unreadCount = unreadData?.count || 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notificações"
        title={isConnected ? 'Conectado - notificações em tempo real' : 'Desconectado'}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {/* Connection indicator */}
        {isConnected && (
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <NotificationDropdown onClose={() => setIsOpen(false)} />
        </>
      )}
    </div>
  );
}
