import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Building2,
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  Activity,
  ArrowRight,
  Plus
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { format } from "date-fns";

const Dashboard = () => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: tasksCount, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: myTasksCount, isLoading: myTasksLoading } = useQuery({
    queryKey: ["my-tasks-count", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("assigned_to", user.id);
      return count || 0;
    },
    enabled: !!user?.id,
  });

  const { data: organizationsCount, isLoading: orgsLoading } = useQuery({
    queryKey: ["organizations-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("organizations")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: projectsCount, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: recentTasks } = useQuery({
    queryKey: ["recent-tasks", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("tasks")
        .select(`
          *,
          project:projects(name),
          assigned_to_profile:profiles!tasks_assigned_to_fkey(full_name)
        `)
        .eq("assigned_to", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Mock data for charts
  const tasksByStatus = [
    { name: "To Do", value: 12, color: "hsl(var(--muted))" },
    { name: "In Progress", value: 8, color: "hsl(var(--primary))" },
    { name: "In Review", value: 5, color: "hsl(var(--warning))" },
    { name: "Completed", value: 24, color: "hsl(var(--success))" },
    { name: "Blocked", value: 3, color: "hsl(var(--destructive))" },
  ];

  const weeklyActivity = [
    { day: "Mon", tasks: 4 },
    { day: "Tue", tasks: 7 },
    { day: "Wed", tasks: 5 },
    { day: "Thu", tasks: 9 },
    { day: "Fri", tasks: 6 },
    { day: "Sat", tasks: 2 },
    { day: "Sun", tasks: 1 },
  ];

  const stats = [
    {
      title: "Total Tasks",
      value: tasksCount,
      loading: tasksLoading,
      icon: CheckSquare,
      description: "Across all projects",
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: "+12%",
    },
    {
      title: "My Tasks",
      value: myTasksCount,
      loading: myTasksLoading,
      icon: LayoutDashboard,
      description: "Assigned to you",
      color: "text-accent",
      bgColor: "bg-accent/10",
      trend: "+5%",
    },
    {
      title: "Organizations",
      value: organizationsCount,
      loading: orgsLoading,
      icon: Building2,
      description: "Active workspaces",
      color: "text-warning",
      bgColor: "bg-warning/10",
      trend: "0%",
    },
    {
      title: "Projects",
      value: projectsCount,
      loading: projectsLoading,
      icon: Users,
      description: "In progress",
      color: "text-success",
      bgColor: "bg-success/10",
      trend: "+8%",
    },
  ];

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-muted text-muted-foreground",
      medium: "bg-primary text-primary-foreground",
      high: "bg-warning text-warning-foreground",
      urgent: "bg-destructive text-destructive-foreground",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      todo: "bg-muted text-muted-foreground",
      in_progress: "bg-primary text-primary-foreground",
      in_review: "bg-warning text-warning-foreground",
      completed: "bg-success text-success-foreground",
      blocked: "bg-destructive text-destructive-foreground",
    };
    return colors[status] || colors.todo;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your projects today
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover-lift border-border shadow-soft overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  {stat.loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold">{stat.value}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {stat.trend}
                      </Badge>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Task Distribution */}
        <Card className="border-border shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Task Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tasksByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tasksByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="border-border shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks and Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Tasks */}
        <Card className="lg:col-span-2 border-border shadow-medium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Recent Tasks
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTasks && recentTasks.length > 0 ? (
                recentTasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {task.project && (
                          <>
                            <span>{task.project.name}</span>
                            <span>•</span>
                          </>
                        )}
                        {task.due_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(task.due_date), "MMM dd")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status?.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No recent tasks</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <Card className="border-border shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alerts & Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">3 Overdue Tasks</p>
                    <p className="text-xs text-muted-foreground">
                      Requires immediate attention
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">5 Tasks Due Today</p>
                    <p className="text-xs text-muted-foreground">
                      Review and prioritize
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-success mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">85% Completion Rate</p>
                    <p className="text-xs text-muted-foreground">
                      Great progress this week!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
