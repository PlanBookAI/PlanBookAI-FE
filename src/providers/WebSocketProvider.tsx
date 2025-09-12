'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { WebSocketMessage, WebSocketState, NotificationDto } from '@/types';

interface WebSocketContextType extends WebSocketState {
  sendMessage: (message: any) => void;
  onNotification: (callback: (notification: NotificationDto) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    error: null,
  });

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const notificationCallbacks = useRef<Set<(notification: NotificationDto) => void>>(new Set());

  const connect = () => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws';
    ws.current = new WebSocket(`${wsUrl}?token=${token}`);

    ws.current.onopen = () => {
      setState(prev => ({ ...prev, isConnected: true, error: null }));
    };

    ws.current.onclose = () => {
      setState(prev => ({ ...prev, isConnected: false }));
      // Attempt to reconnect after 5 seconds
      reconnectTimeout.current = setTimeout(connect, 5000);
    };

    ws.current.onerror = (error) => {
      setState(prev => ({ ...prev, error: 'WebSocket connection error' }));
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        if (message.type === 'notification') {
          notificationCallbacks.current.forEach(callback => callback(message.data));
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  };

  useEffect(() => {
    connect();

    return () => {
      ws.current?.close();
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  const onNotification = (callback: (notification: NotificationDto) => void) => {
    notificationCallbacks.current.add(callback);
    return () => {
      notificationCallbacks.current.delete(callback);
    };
  };

  return (
    <WebSocketContext.Provider value={{ ...state, sendMessage, onNotification }}>
      {children}
    </WebSocketContext.Provider>
  );
};