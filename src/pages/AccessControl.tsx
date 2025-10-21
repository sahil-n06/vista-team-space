import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, UserPlus, Lock, Users, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

const AccessControl = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createRoleDialogOpen, setCreateRoleDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [newRoleUserId, setNewRoleUserId] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("");

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["profiles-with-roles"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles(role, id)
        `)
        .order("full_name");
      return data || [];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ 
      userId, 
      oldRole, 
      newRole 
    }: { 
      userId: string; 
      oldRole?: Database["public"]["Enums"]["app_role"]; 
      newRole: Database["public"]["Enums"]["app_role"] 
    }) => {
      // Delete old role if exists
      if (oldRole) {
        const { error: deleteError } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", oldRole);
        
        if (deleteError) throw deleteError;
      }

      // Insert new role
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({ 
          user_id: userId, 
          role: newRole
        });
      
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles-with-roles"] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      setEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user role: " + error.message,
        variant: "destructive",
      });
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: async ({ 
      userId, 
      role 
    }: { 
      userId: string; 
      role: Database["public"]["Enums"]["app_role"] 
    }) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ 
          user_id: userId, 
          role: role
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles-with-roles"] });
      toast({
        title: "Success",
        description: "Role assigned successfully",
      });
      setCreateRoleDialogOpen(false);
      setNewRoleUserId("");
      setNewRole("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to assign role: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleEditRole = (profile: any) => {
    setSelectedProfile(profile);
    setSelectedRole(profile.user_roles?.[0]?.role || "staff");
    setEditDialogOpen(true);
  };

  const handleUpdateRole = () => {
    if (selectedProfile && selectedRole) {
      updateRoleMutation.mutate({
        userId: selectedProfile.id,
        oldRole: selectedProfile.user_roles?.[0]?.role,
        newRole: selectedRole as Database["public"]["Enums"]["app_role"],
      });
    }
  };

  const handleCreateRole = () => {
    if (newRoleUserId && newRole) {
      createRoleMutation.mutate({
        userId: newRoleUserId,
        role: newRole as Database["public"]["Enums"]["app_role"],
      });
    }
  };

  const getRoleBadge = (roles: any[]) => {
    if (!roles || roles.length === 0) return <Badge variant="secondary">Staff</Badge>;
    
    const role = roles[0]?.role;
    const colors: Record<string, string> = {
      super_admin: "bg-destructive text-destructive-foreground",
      admin: "bg-warning text-warning-foreground",
      manager: "bg-primary text-primary-foreground",
      staff: "bg-muted text-muted-foreground",
    };

    return (
      <Badge className={colors[role] || colors.staff}>
        {role?.replace("_", " ") || "staff"}
      </Badge>
    );
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("");
  };

  const roleStats = [
    { role: "Super Admin", count: 1, icon: Lock, color: "text-destructive" },
    { role: "Admin", count: 2, icon: Shield, color: "text-warning" },
    { role: "Manager", count: 3, icon: Users, color: "text-primary" },
    { role: "Staff", count: profiles?.filter((p: any) => !p.user_roles || p.user_roles.length === 0 || p.user_roles[0]?.role === "staff").length || 0, icon: UserPlus, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Access Control</h1>
          <p className="text-muted-foreground">
            Manage roles and permissions for your team
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={createRoleDialogOpen} onOpenChange={setCreateRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" variant="outline">
                <Plus className="h-4 w-4" />
                Assign Role
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background">
              <DialogHeader>
                <DialogTitle>Assign Role to User</DialogTitle>
                <DialogDescription>
                  Select a user and assign them a role
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>User</Label>
                  <Select value={newRoleUserId} onValueChange={setNewRoleUserId}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {profiles?.map((profile: any) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.full_name || "Unknown User"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleCreateRole} 
                  disabled={!newRoleUserId || !newRole || createRoleMutation.isPending}
                  className="w-full"
                >
                  {createRoleMutation.isPending ? "Assigning..." : "Assign Role"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Role Statistics */}
      <div className="grid gap-6 md:grid-cols-4">
        {roleStats.map((stat) => (
          <Card key={stat.role} className="border-border shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-sm text-muted-foreground">{stat.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permission Matrix */}
      <Card className="border-border shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permission Matrix
          </CardTitle>
          <CardDescription>
            Overview of permissions by role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Permission</th>
                  <th className="text-center py-3 px-4 font-medium">Super Admin</th>
                  <th className="text-center py-3 px-4 font-medium">Admin</th>
                  <th className="text-center py-3 px-4 font-medium">Manager</th>
                  <th className="text-center py-3 px-4 font-medium">Staff</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Manage Users", superAdmin: true, admin: true, manager: false, staff: false },
                  { name: "Create Projects", superAdmin: true, admin: true, manager: true, staff: false },
                  { name: "Edit Tasks", superAdmin: true, admin: true, manager: true, staff: true },
                  { name: "Delete Tasks", superAdmin: true, admin: true, manager: true, staff: false },
                  { name: "View Reports", superAdmin: true, admin: true, manager: true, staff: true },
                  { name: "Export Data", superAdmin: true, admin: true, manager: false, staff: false },
                ].map((permission) => (
                  <tr key={permission.name} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{permission.name}</td>
                    <td className="text-center py-3 px-4">
                      {permission.superAdmin ? "✓" : "✗"}
                    </td>
                    <td className="text-center py-3 px-4">
                      {permission.admin ? "✓" : "✗"}
                    </td>
                    <td className="text-center py-3 px-4">
                      {permission.manager ? "✓" : "✗"}
                    </td>
                    <td className="text-center py-3 px-4">
                      {permission.staff ? "✓" : "✗"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="border-border shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            Manage individual user permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {profiles?.map((profile: any) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback>
                        {getInitials(profile.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{profile.full_name || "Unknown User"}</p>
                      <p className="text-xs text-muted-foreground">
                        {profile.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(profile.user_roles)}
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleEditRole(profile)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedProfile?.full_name || "this user"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Role</Label>
              <Input 
                value={selectedProfile?.user_roles?.[0]?.role?.replace("_", " ") || "staff"} 
                disabled 
                className="capitalize bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>New Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleUpdateRole} 
              disabled={updateRoleMutation.isPending}
              className="w-full"
            >
              {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessControl;
