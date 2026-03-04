import { create } from "zustand";
import type { Profile, Server, Channel, Member } from "@/types/database";

interface AppState {
  // User
  user: Profile | null;
  setUser: (user: Profile | null) => void;

  // Servers
  servers: Server[];
  setServers: (servers: Server[]) => void;
  activeServerId: string | null;
  setActiveServerId: (id: string | null) => void;

  // Channels
  channels: Channel[];
  setChannels: (channels: Channel[]) => void;
  activeChannelId: string | null;
  setActiveChannelId: (id: string | null) => void;

  // Members
  members: Member[];
  setMembers: (members: Member[]) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  membersPanelOpen: boolean;
  setMembersPanelOpen: (open: boolean) => void;
  threadOpen: boolean;
  setThreadOpen: (open: boolean) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  servers: [],
  setServers: (servers) => set({ servers }),
  activeServerId: null,
  setActiveServerId: (id) => set({ activeServerId: id }),

  channels: [],
  setChannels: (channels) => set({ channels }),
  activeChannelId: null,
  setActiveChannelId: (id) => set({ activeChannelId: id }),

  members: [],
  setMembers: (members) => set({ members }),

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  membersPanelOpen: false,
  setMembersPanelOpen: (open) => set({ membersPanelOpen: open }),
  threadOpen: false,
  setThreadOpen: (open) => set({ threadOpen: open }),
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
}));
