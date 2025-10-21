import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User, MessageSquare, CheckCircle2, Filter } from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { TaskDetailDialog } from "@/components/project/TaskDetailDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Tasks = () => {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
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

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      const matchesSearch = searchQuery === "" || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

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

      {/* Filters Section */}
      <Card className="border-border shadow-soft">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : filteredTasks && filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const completedChecklist = task.task_checklist_items?.filter((item: any) => item.completed).length || 0;
            const totalChecklist = task.task_checklist_items?.length || 0;
            const commentCount = task.comments?.length || 0;

            return (
              <Card
                key={task.id}
                className={`border-l-4 ${getPriorityColor(
                  task.priority
                )} hover-lift shadow-soft cursor-pointer transition-all h-full flex flex-col`}
                onClick={() => setSelectedTask(task)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold line-clamp-2 flex-1">{task.title}</h3>
                    <Badge className={`${getStatusColor(task.status)} text-xs shrink-0`}>
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="space-y-2 text-xs">
                      {task.organization && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span className="truncate">{task.organization.name}</span>
                        </div>
                      )}
                      {task.due_date && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(task.due_date), "MMM dd")}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs">
                      <Badge variant="outline" className="capitalize text-xs px-2 py-0">
                        {task.priority}
                      </Badge>
                      {totalChecklist > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{completedChecklist}/{totalChecklist}</span>
                        </div>
                      )}
                      {commentCount > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          <span>{commentCount}</span>
                        </div>
                      )}
                    </div>

                    {task.assignee && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar_url} />
                        <AvatarFallback className="text-[10px]">
                          {task.assignee.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : tasks && tasks.length > 0 ? (
        <Card className="border-border shadow-medium">
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              No tasks match your filters
            </p>
          </CardContent>
        </Card>
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
