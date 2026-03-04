import { create } from "zustand";
import type { MessageWithAuthor } from "@/types/database";

interface ChatState {
  messages: MessageWithAuthor[];
  setMessages: (messages: MessageWithAuthor[]) => void;
  addMessage: (message: MessageWithAuthor) => void;
  updateMessage: (id: string, content: string) => void;
  deleteMessage: (id: string) => void;

  replyTo: MessageWithAuthor | null;
  setReplyTo: (message: MessageWithAuthor | null) => void;

  editingMessageId: string | null;
  setEditingMessageId: (id: string | null) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  typingUsers: string[];
  setTypingUsers: (users: string[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content, edited_at: new Date().toISOString() } : m
      ),
    })),
  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    })),

  replyTo: null,
  setReplyTo: (message) => set({ replyTo: message }),

  editingMessageId: null,
  setEditingMessageId: (id) => set({ editingMessageId: id }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  typingUsers: [],
  setTypingUsers: (users) => set({ typingUsers: users }),
}));
