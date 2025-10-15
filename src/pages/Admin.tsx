import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Building2, CheckSquare, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

const Admin = () => {
  const { user } = useAuth();

  const { data: userRole, isLoading: roleLoading } = useQuery({
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
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [users, orgs, tasks, roles] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("organizations").select("*", { count: "exact", head: true }),
        supabase.from("tasks").select("*", { count: "exact", head: true }),
        supabase.from("user_roles").select("*", { count: "exact", head: true }),
      ]);
      return {
        users: users.count || 0,
        organizations: orgs.count || 0,
        tasks: tasks.count || 0,
        roles: roles.count || 0,
      };
    },
    enabled: userRole === "super_admin",
  });

  if (roleLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (userRole !== "super_admin") {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Admin Portal</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access Denied: You do not have Super Admin permissions to access this portal.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const adminStats = [
    {
      title: "Total Users",
      value: stats?.users,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Organizations",
      value: stats?.organizations,
      icon: Building2,
      color: "text-accent",
    },
    {
      title: "Total Tasks",
      value: stats?.tasks,
      icon: CheckSquare,
      color: "text-success",
    },
    {
      title: "Role Assignments",
      value: stats?.roles,
      icon: Shield,
      color: "text-warning",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground">System-wide management and analytics</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <Card key={stat.title} className="hover-lift border-border shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border shadow-medium">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Manage user accounts, roles, and permissions
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-medium">
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Configure system-wide settings and preferences
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-medium">
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              View system activity and audit logs
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-medium">
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              System performance and usage analytics
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
