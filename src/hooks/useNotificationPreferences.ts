'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationPreference } from '@prisma/client';
import { NotificationPreferenceUpdate } from '@/types/notification';

/**
 * Hook to fetch notification preferences
 */
export function useNotificationPreferences() {
  return useQuery<NotificationPreference>({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      const response = await fetch('/api/notifications/preferences');

      if (!response.ok) {
        throw new Error('Failed to fetch notification preferences');
      }

      return response.json();
    },
  });
}

/**
 * Hook to update notification preferences
 */
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: NotificationPreferenceUpdate) => {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    },
  });
}
