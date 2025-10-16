import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User, MessageSquare, CheckCircle2, Users } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { TaskDetailDialog } from "@/components/project/TaskDetailDialog";

const Tasks = () => {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  
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
          assignee:profiles!tasks_assigned_to_fkey(full_name, avatar_url),
          task_checklist_items(*),
          comments:comments(id, content, created_at)
        `
        )
        .eq("assigned_to", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .limit(5);

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
          {tasks.map((task) => {
            const completedChecklist = task.task_checklist_items?.filter((item: any) => item.completed).length || 0;
            const totalChecklist = task.task_checklist_items?.length || 0;
            const commentCount = task.comments?.length || 0;

            return (
              <Card
                key={task.id}
                className={`border-l-4 ${getPriorityColor(
                  task.priority
                )} hover-lift shadow-soft cursor-pointer transition-all`}
                onClick={() => setSelectedTask(task)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
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
                  <div className="space-y-4">
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        {totalChecklist > 0 && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{completedChecklist}/{totalChecklist}</span>
                          </div>
                        )}
                        {commentCount > 0 && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            <span>{commentCount}</span>
                          </div>
                        )}
                      </div>

                      {task.assignee && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={task.assignee.avatar_url} />
                            <AvatarFallback className="text-xs">
                              {task.assignee.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {task.assignee.full_name}
                          </span>
                        </div>
                      )}
                    </div>

                    {teamMembers && teamMembers.length > 0 && (
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div className="flex -space-x-2">
                          {teamMembers.slice(0, 3).map((member) => (
                            <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={member.avatar_url} />
                              <AvatarFallback className="text-xs">
                                {member.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {teamMembers.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                              <span className="text-[10px] text-muted-foreground">+{teamMembers.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
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

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default Tasks;
