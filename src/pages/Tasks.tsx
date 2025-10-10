import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";

const Tasks = () => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["my-tasks"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("tasks")
        .select(
          `
          *,
          organization:organizations(name),
          assignee:profiles!tasks_assigned_to_fkey(full_name)
        `
        )
        .eq("assigned_to", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

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

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "border-muted-foreground",
      medium: "border-primary",
      high: "border-warning",
      urgent: "border-destructive",
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
        <p className="text-muted-foreground">
          Tasks assigned to you across all organizations
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : tasks && tasks.length > 0 ? (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={`border-l-4 ${getPriorityColor(
                task.priority
              )} hover-lift shadow-soft`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {task.organization && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{task.organization.name}</span>
                    </div>
                  )}
                  {task.due_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Due {format(new Date(task.due_date), "MMM dd, yyyy")}</span>
                    </div>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {task.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border shadow-medium">
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              No tasks assigned to you yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tasks;
