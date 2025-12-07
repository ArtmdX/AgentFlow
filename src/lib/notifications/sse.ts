/**
 * Server-Sent Events (SSE) utilities for real-time notifications
 */

// Map of active SSE connections (userId -> controller)
export const activeConnections = new Map<string, ReadableStreamDefaultController>();

/**
 * Send notification to a specific user via SSE
 * If the user has an active SSE connection, the notification will be sent in real-time
 */
export function sendNotificationToUser(userId: string, notification: any) {
  const controller = activeConnections.get(userId);

  if (controller) {
    try {
      const message = `data: ${JSON.stringify({
        event: 'notification',
        data: notification
      })}\n\n`;

      controller.enqueue(new TextEncoder().encode(message));
    } catch (error) {
      console.error('Error sending notification via SSE:', error);
      // Remove connection if it's no longer valid
      activeConnections.delete(userId);
    }
  }
}
