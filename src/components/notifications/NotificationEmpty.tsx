'use client';

import { Bell } from 'lucide-react';

export function NotificationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Bell className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-600 font-medium mb-1">Nenhuma notificação</p>
      <p className="text-sm text-gray-400">
        Você está em dia! Não há notificações no momento.
      </p>
    </div>
  );
}
