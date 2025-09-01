import { useAppStore } from '../state/store';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

let ws: WebSocket | null = null;

const connect = () => {
  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log('WebSocket connected');
    const { offlineQueue, dequeueOfflineMessage } = useAppStore.getState();
    offlineQueue.forEach((item) => {
      if (item.type === 'message') {
        sendOrQueue(item.payload);
        dequeueOfflineMessage(item.id);
      }
    });
  };

  ws.onmessage = (event) => {
    const evt = JSON.parse(event.data);
    console.log('Received:', evt);
    if (evt.type === 'server.message.created') {
      useAppStore.getState().addMessage(evt.message);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    setTimeout(connect, 800);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    ws?.close();
  };
};

export function sendOrQueue(payload: any) {
  try {
    ws?.send(JSON.stringify({ type: 'client.message.send', data: payload }));
  } catch {
    useAppStore.getState().enqueueOfflineMessage({
      id: payload.idempotencyKey,
      type: 'message',
      payload,
    });
  }
}

connect();
