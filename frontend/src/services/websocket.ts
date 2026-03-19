// src/services/websocket.ts
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useWebSocket = (
  taskId: string | null,
  onProgress: (data: { progress: number; message: string }) => void
) => {
  useEffect(() => {
    if (!taskId) return;

    // Connect to WebSocket server (adjust URL as needed)
    socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:8000');

    socket.emit('join', taskId);

    socket.on('progress', (data) => {
      onProgress(data);
    });

    socket.on('completed', () => {
      onProgress({ progress: 100, message: '✅ Ready!' });
      socket?.disconnect();
    });

    socket.on('error', (err) => {
      console.error('WebSocket error', err);
    });

    return () => {
      socket?.disconnect();
    };
  }, [taskId, onProgress]);
};