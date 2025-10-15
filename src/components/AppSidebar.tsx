import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  Shield,
  BarChart3,
  Settings,
  Building2,
  Users,
  LogOut,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Plus,
  FolderKanban,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Comments", url: "/comments", icon: MessageSquare },
  { title: "Clients", url: "/clients", icon: Building2 },
  { title: "Team", url: "/team", icon: Users },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Access Control", url: "/access", icon: Shield },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const currentPath = location.pathname;

  const { data: userRole } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      return data?.role;
    },
    enabled: !!user,
  });

  const { data: workspaces } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const { data } = await supabase
        .from("organizations")
        .select(`
          id,
          name,
          slug,
          projects (
            id,
            name,
            status
          )
        `)
        .order("name");
      return data || [];
    },
  });

  const [expandedWorkspaces, setExpandedWorkspaces] = useState<string[]>([]);

  const toggleWorkspace = (workspaceId: string) => {
    setExpandedWorkspaces(prev =>
      prev.includes(workspaceId)
        ? prev.filter(id => id !== workspaceId)
        : [...prev, workspaceId]
    );
  };

  const isActive = (path: string) => currentPath === path;
  const collapsed = state === "collapsed";
  const isSuperAdmin = userRole === "super_admin";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {!collapsed && workspaces && workspaces.length > 0 && (
          <SidebarGroup className="pt-6 border-b border-sidebar-border pb-4">
            <div className="flex items-center justify-between px-3 mb-2">
              <SidebarGroupLabel className="text-xs font-semibold">Spaces</SidebarGroupLabel>
              <Plus className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {workspaces.map((workspace: any) => (
                  <div key={workspace.id}>
                    <SidebarMenuItem>
                      <button
                        onClick={() => toggleWorkspace(workspace.id)}
                        className="flex items-center gap-2 px-3 py-2 w-full hover:bg-sidebar-accent/50 rounded-lg transition-all"
                      >
                        <div className="h-5 w-5 rounded bg-primary/20 flex items-center justify-center shrink-0">
                          <Building2 className="h-3 w-3 text-primary" />
                        </div>
                        <span className="flex-1 text-left text-sm truncate">{workspace.name}</span>
                        {expandedWorkspaces.includes(workspace.id) ? (
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                      </button>
                    </SidebarMenuItem>
                    {expandedWorkspaces.includes(workspace.id) && workspace.projects && (
                      <div className="ml-6 mt-1 space-y-1">
                        {workspace.projects.map((project: any) => (
                          <NavLink
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                                isActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                  : "hover:bg-sidebar-accent/50"
                              }`
                            }
                          >
                            <FolderKanban className="h-4 w-4 shrink-0" />
                            <span className="truncate">{project.name}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="pt-6">
          {!collapsed && (
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "hover:bg-sidebar-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {isSuperAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "hover:bg-sidebar-accent/50"
                        }`
                      }
                    >
                      <ShieldCheck className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>Admin Portal</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="ml-3">Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
