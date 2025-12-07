import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { activeConnections } from '@/lib/notifications/sse';

/**
 * GET /api/notifications/stream
 * Server-Sent Events endpoint for real-time notifications
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;

  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // Close any existing connection for this user
      const existingController = activeConnections.get(userId);
      if (existingController) {
        try {
          existingController.close();
        } catch (_e) {
          // Already closed
        }
      }

      // Register new connection
      activeConnections.set(userId, controller);

      // Send initial connection message
      const connectedMessage = `data: ${JSON.stringify({ event: 'connected', timestamp: new Date().toISOString() })}\n\n`;
      controller.enqueue(new TextEncoder().encode(connectedMessage));

      // Heartbeat to keep connection alive (every 30 seconds)
      const heartbeatInterval = setInterval(() => {
        try {
          const heartbeat = `data: ${JSON.stringify({ event: 'heartbeat', timestamp: new Date().toISOString() })}\n\n`;
          controller.enqueue(new TextEncoder().encode(heartbeat));
        } catch (_error) {
          // Connection closed, cleanup
          clearInterval(heartbeatInterval);
          activeConnections.delete(userId);
        }
      }, 30000);

      // Auto-close connection after 5 minutes of inactivity
      const timeoutId = setTimeout(() => {
        try {
          clearInterval(heartbeatInterval);
          const closeMessage = `data: ${JSON.stringify({ event: 'close', reason: 'timeout' })}\n\n`;
          controller.enqueue(new TextEncoder().encode(closeMessage));
          controller.close();
          activeConnections.delete(userId);
        } catch (_error) {
          // Already closed
        }
      }, 300000); // 5 minutes

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
        clearTimeout(timeoutId);
        activeConnections.delete(userId);
        try {
          controller.close();
        } catch (_error) {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}
