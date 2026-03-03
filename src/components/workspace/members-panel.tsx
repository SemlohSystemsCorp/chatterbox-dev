"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Search,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  Crown,
  UserMinus,
  LogOut,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/client";

interface MemberData {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    full_name: string | null;
    display_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
}

interface MembersPanelProps {
  workspaceId: string;
  currentUserId: string;
  currentUserRole: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ROLE_ORDER = ["owner", "admin", "member", "guest"];
const ROLE_LABELS: Record<string, string> = {
  owner: "Owners",
  admin: "Admins",
  member: "Members",
  guest: "Guests",
};

export function MembersPanel({
  workspaceId,
  currentUserId,
  currentUserRole,
  open,
  onOpenChange,
}: MembersPanelProps) {
  const router = useRouter();
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("workspace_members")
      .select(
        "id, user_id, role, joined_at, profiles(full_name, display_name, email, avatar_url)"
      )
      .eq("workspace_id", workspaceId)
      .order("joined_at");

    if (data) {
      setMembers(data as unknown as MemberData[]);
    }
    setLoading(false);
  }, [workspaceId]);

  useEffect(() => {
    if (open) {
      fetchMembers();
      setSearchQuery("");
      setError(null);
      setLeaveConfirm(false);
    }
  }, [open, fetchMembers]);

  function getDisplayName(member: MemberData) {
    return (
      member.profiles?.display_name ||
      member.profiles?.full_name ||
      member.profiles?.email ||
      "Unknown"
    );
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function canManage(target: MemberData) {
    if (target.user_id === currentUserId) return false;
    if (currentUserRole === "owner") return true;
    if (currentUserRole === "admin") {
      return target.role === "member" || target.role === "guest";
    }
    return false;
  }

  function canPromoteTo(targetRole: string, newRole: string) {
    if (currentUserRole === "owner") return targetRole !== newRole;
    if (currentUserRole === "admin") {
      // Admins can only toggle between member and guest
      return (
        ["member", "guest"].includes(newRole) && targetRole !== newRole
      );
    }
    return false;
  }

  async function changeRole(memberId: string, role: string) {
    setActionLoading(memberId);
    setError(null);

    try {
      const res = await fetch(
        `/api/workspaces/${workspaceId}/members/${memberId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to change role.");
      } else {
        setMembers((prev) =>
          prev.map((m) => (m.id === memberId ? { ...m, role } : m))
        );
      }
    } catch {
      setError("Something went wrong.");
    }

    setActionLoading(null);
  }

  async function removeMember(memberId: string) {
    setActionLoading(memberId);
    setError(null);

    try {
      const res = await fetch(
        `/api/workspaces/${workspaceId}/members/${memberId}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to remove member.");
      } else {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
      }
    } catch {
      setError("Something went wrong.");
    }

    setActionLoading(null);
  }

  async function handleLeave() {
    setLeaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/leave`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to leave workspace.");
        setLeaving(false);
      } else {
        onOpenChange(false);
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong.");
      setLeaving(false);
    }
  }

  const filteredMembers = members.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = getDisplayName(m).toLowerCase();
    const email = (m.profiles?.email || "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const groupedMembers = ROLE_ORDER.map((role) => ({
    role,
    label: ROLE_LABELS[role],
    members: filteredMembers.filter((m) => m.role === role),
  })).filter((g) => g.members.length > 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Members</SheetTitle>
          <SheetDescription>
            {members.length} member{members.length !== 1 ? "s" : ""} in this
            workspace
          </SheetDescription>
        </SheetHeader>

        {/* Search */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Separator />

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Members list */}
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="px-6 py-4 space-y-6">
              {groupedMembers.map((group) => (
                <div key={group.role}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    {group.label} ({group.members.length})
                  </p>
                  <div className="space-y-1">
                    {group.members.map((member) => {
                      const name = getDisplayName(member);
                      const isMe = member.user_id === currentUserId;
                      return (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors"
                        >
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="text-xs">
                              {getInitials(name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium truncate">
                                {name}
                              </p>
                              {isMe && (
                                <span className="text-[10px] text-muted-foreground">
                                  (you)
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {member.profiles?.email}
                            </p>
                          </div>

                          <Badge
                            variant={
                              member.role === "owner"
                                ? "default"
                                : "secondary"
                            }
                            className="text-[10px] shrink-0"
                          >
                            {member.role}
                          </Badge>

                          {canManage(member) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 shrink-0"
                                  disabled={actionLoading === member.id}
                                >
                                  {actionLoading === member.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {currentUserRole === "owner" && (
                                  <>
                                    {canPromoteTo(member.role, "owner") && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          changeRole(member.id, "owner")
                                        }
                                      >
                                        <Crown className="mr-2 h-4 w-4" />
                                        Make owner
                                      </DropdownMenuItem>
                                    )}
                                    {canPromoteTo(member.role, "admin") && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          changeRole(member.id, "admin")
                                        }
                                      >
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Make admin
                                      </DropdownMenuItem>
                                    )}
                                  </>
                                )}
                                {canPromoteTo(member.role, "member") && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      changeRole(member.id, "member")
                                    }
                                  >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Make member
                                  </DropdownMenuItem>
                                )}
                                {canPromoteTo(member.role, "guest") && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      changeRole(member.id, "guest")
                                    }
                                  >
                                    <ChevronDown className="mr-2 h-4 w-4" />
                                    Make guest
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => removeMember(member.id)}
                                >
                                  <UserMinus className="mr-2 h-4 w-4" />
                                  Remove from workspace
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredMembers.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No members found.
                </p>
              )}
            </div>
          )}
        </ScrollArea>

        <Separator />

        {/* Footer */}
        <div className="px-6 py-4">
          {!leaveConfirm ? (
            <Button
              variant="outline"
              className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setLeaveConfirm(true)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Leave workspace
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-destructive text-center">
                Are you sure you want to leave?
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLeaveConfirm(false)}
                  disabled={leaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleLeave}
                  disabled={leaving}
                >
                  {leaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Leave"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
