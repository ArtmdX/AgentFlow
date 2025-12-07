'use client';

import { Notification as NotificationType } from '@prisma/client';
import { Info, AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';
import { useMarkAsRead, useDeleteNotification } from '@/hooks/useNotifications';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationItemProps {
  notification: NotificationType;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const markAsRead = useMarkAsRead();
  const deleteNotification = useDeleteNotification();

  const handleClick = async () => {
    // Mark as read if not already
    if (!notification.isRead) {
      await markAsRead.mutateAsync(notification.id);
    }

    // Navigate to action URL if exists
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification.mutateAsync(notification.id);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'normal':
        return 'border-l-blue-500';
      case 'low':
      default:
        return 'border-l-gray-300';
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div
      onClick={handleClick}
      className={`
        relative p-4 border-l-4 ${getBorderColor()}
        ${notification.isRead ? 'bg-white' : 'bg-blue-50'}
        hover:bg-gray-50 cursor-pointer transition-colors
        group
      `}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-sm text-gray-900">
              {notification.title}
            </p>

            <button
              onClick={handleDelete}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Deletar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {notification.message}
          </p>

          <p className="mt-2 text-xs text-gray-400">{timeAgo}</p>

          {!notification.isRead && (
            <span className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </div>
      </div>
    </div>
  );
}
