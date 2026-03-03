"use client";

import { create } from "zustand";
import type { Channel, Message, Workspace } from "@/types/database";

interface ChatState {
  activeWorkspace: Workspace | null;
  activeChannel: Channel | null;
  messages: Message[];
  isThreadOpen: boolean;
  threadParentId: string | null;
  onlineUsers: Set<string>;
  typingUsers: Map<string, string>;

  setActiveWorkspace: (workspace: Workspace | null) => void;
  setActiveChannel: (channel: Channel | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, content: string) => void;
  removeMessage: (id: string) => void;
  openThread: (parentId: string) => void;
  closeThread: () => void;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  setUserTyping: (userId: string, displayName: string) => void;
  clearUserTyping: (userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeWorkspace: null,
  activeChannel: null,
  messages: [],
  isThreadOpen: false,
  threadParentId: null,
  onlineUsers: new Set(),
  typingUsers: new Map(),

  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
  setActiveChannel: (channel) => set({ activeChannel: channel }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content, is_edited: true } : m
      ),
    })),
  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    })),
  openThread: (parentId) =>
    set({ isThreadOpen: true, threadParentId: parentId }),
  closeThread: () => set({ isThreadOpen: false, threadParentId: null }),
  setUserOnline: (userId) =>
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.add(userId);
      return { onlineUsers: next };
    }),
  setUserOffline: (userId) =>
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.delete(userId);
      return { onlineUsers: next };
    }),
  setUserTyping: (userId, displayName) =>
    set((state) => {
      const next = new Map(state.typingUsers);
      next.set(userId, displayName);
      return { typingUsers: next };
    }),
  clearUserTyping: (userId) =>
    set((state) => {
      const next = new Map(state.typingUsers);
      next.delete(userId);
      return { typingUsers: next };
    }),
}));
