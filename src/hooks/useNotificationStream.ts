'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Notification } from '@prisma/client';

interface SSEMessage {
  event: string;
  data?: any;
  timestamp?: string;
}

/**
 * Hook to connect to Server-Sent Events stream for real-time notifications
 */
export function useNotificationStream(
  onNotification: (notification: Notification) => void
) {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (!session?.user) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const eventSource = new EventSource('/api/notifications/stream');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('[NotificationStream] SSE connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const message: SSEMessage = JSON.parse(event.data);

          switch (message.event) {
            case 'connected':
              console.log('[NotificationStream] Connection established');
              break;

            case 'notification':
              console.log('[NotificationStream] New notification received', message.data);
              if (message.data) {
                onNotification(message.data);
              }
              break;

            case 'heartbeat':
              // Keep connection alive
              break;

            case 'close':
              console.log('[NotificationStream] Server closed connection:', message);
              eventSource.close();
              break;

            default:
              console.log('[NotificationStream] Unknown event:', message.event);
          }
        } catch (error) {
          console.error('[NotificationStream] Error parsing message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('[NotificationStream] SSE error:', error);
        setIsConnected(false);
        eventSource.close();

        // Exponential backoff for reconnection
        const backoffTime = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        reconnectAttemptsRef.current += 1;

        console.log(`[NotificationStream] Reconnecting in ${backoffTime}ms (attempt ${reconnectAttemptsRef.current})`);

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, backoffTime);
      };
    } catch (error) {
      console.error('[NotificationStream] Error creating EventSource:', error);
      setIsConnected(false);
    }
  }, [session, onNotification]);

  useEffect(() => {
    if (!session?.user) {
      setIsConnected(false);
      return;
    }

    connect();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      setIsConnected(false);
    };
  }, [session, connect]);

  return { isConnected };
}
