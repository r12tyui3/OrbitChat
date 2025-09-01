import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface Room {
  id: string;
  name: string;
}

interface OfflineQueueItem {
  id: string;
  type: 'message';
  payload: any;
}

interface AppState {
  rooms: Room[];
  messages: Message[];
  offlineQueue: OfflineQueueItem[];
  addRoom: (room: Room) => void;
  addMessage: (message: Message) => void;
  enqueueOfflineMessage: (message: any) => void;
  dequeueOfflineMessage: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  rooms: [],
  messages: [],
  offlineQueue: [],
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  enqueueOfflineMessage: (payload) =>
    set((state) => ({
      offlineQueue: [...state.offlineQueue, { id: uuidv4(), type: 'message', payload }],
    })),
  dequeueOfflineMessage: (id) =>
    set((state) => ({
      offlineQueue: state.offlineQueue.filter((item) => item.id !== id),
    })),
}));