import { NotificationDto } from '.';

export interface WebSocketMessage {
  type: 'notification';
  data: NotificationDto;
}

export interface WebSocketState {
  isConnected: boolean;
  error: string | null;
}