"use client";

import { createContext, useContext } from "react";

interface WorkspaceContextValue {
  workspaceId: string;
  workspaceName: string;
  currentUserId: string;
  currentUserRole: string;
  openInviteModal: () => void;
  openMembersPanel: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  workspaceId: "",
  workspaceName: "",
  currentUserId: "",
  currentUserRole: "member",
  openInviteModal: () => {},
  openMembersPanel: () => {},
});

export function WorkspaceProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: WorkspaceContextValue;
}) {
  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
