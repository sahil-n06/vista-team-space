import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Building2, Users, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data: tasksCount, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: orgsCount, isLoading: orgsLoading } = useQuery({
    queryKey: ["organizations-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("organizations")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: myTasks, isLoading: myTasksLoading } = useQuery({
    queryKey: ["my-tasks-count"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("assigned_to", user.id);
      return count || 0;
    },
  });

  const stats = [
    {
      title: "My Tasks",
      value: myTasks,
      loading: myTasksLoading,
      icon: CheckSquare,
      description: "Tasks assigned to you",
      color: "text-primary",
    },
    {
      title: "Total Tasks",
      value: tasksCount,
      loading: tasksLoading,
      icon: TrendingUp,
      description: "All tasks in the system",
      color: "text-accent",
    },
    {
      title: "Organizations",
      value: orgsCount,
      loading: orgsLoading,
      icon: Building2,
      description: "Active organizations",
      color: "text-success",
    },
    {
      title: "Team Members",
      value: "—",
      loading: false,
      icon: Users,
      description: "Coming soon",
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Good morning! 👋</h1>
        <p className="text-muted-foreground">
          Here's an overview of your workspace today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="hover-lift border-border shadow-soft backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 bg-${stat.color.replace('text-', '')}/10`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
              <CardDescription className="text-xs mt-1">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border shadow-medium">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest task updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              No recent activity to display
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-medium">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Create tasks, manage organizations, and more...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
