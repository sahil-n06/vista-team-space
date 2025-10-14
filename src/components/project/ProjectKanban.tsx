import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface ProjectKanbanProps {
  tasks: any[];
  projectId: string;
}

const statusColumns = [
  { id: 'todo', label: 'To Do', icon: Circle, color: 'text-muted-foreground' },
  { id: 'in_progress', label: 'In Progress', icon: Clock, color: 'text-primary' },
  { id: 'in_review', label: 'In Review', icon: AlertCircle, color: 'text-accent' },
  { id: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-success' },
  { id: 'blocked', label: 'Blocked', icon: AlertCircle, color: 'text-destructive' },
];

const priorityColors = {
  urgent: 'border-l-4 border-l-destructive',
  high: 'border-l-4 border-l-orange-500',
  medium: 'border-l-4 border-l-primary',
  low: 'border-l-4 border-l-muted-foreground',
};

const ProjectKanban = ({ tasks }: ProjectKanbanProps) => {
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status && !task.parent_task_id);
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statusColumns.map(column => {
        const columnTasks = getTasksByStatus(column.id);
        const Icon = column.icon;

        return (
          <div key={column.id} className="flex-shrink-0 w-80">
            <Card className="border-border shadow-soft h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${column.color}`} />
                    <span>{column.label}</span>
                  </div>
                  <Badge variant="secondary">{columnTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {columnTasks.map(task => {
                  const subtasks = tasks.filter(t => t.parent_task_id === task.id);
                  const completedSubtasks = subtasks.filter(t => t.status === 'completed').length;
                  const checklistItems = task.task_checklist_items || [];
                  const completedChecklist = checklistItems.filter((item: any) => item.completed).length;

                  return (
                    <Card 
                      key={task.id} 
                      className={`hover-lift cursor-pointer transition-all ${priorityColors[task.priority as keyof typeof priorityColors]}`}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <Badge variant="outline" className="text-xs">
                            {task.priority}
                          </Badge>
                          {task.due_date && (
                            <span className="text-muted-foreground">
                              {format(new Date(task.due_date), "MMM dd")}
                            </span>
                          )}
                        </div>

                        {subtasks.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{completedSubtasks}/{subtasks.length} subtasks</span>
                          </div>
                        )}

                        {checklistItems.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Circle className="h-3 w-3" />
                            <span>{completedChecklist}/{checklistItems.length} checklist</span>
                          </div>
                        )}

                        {task.assigned_to_profile && (
                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assigned_to_profile.avatar_url} />
                              <AvatarFallback className="text-xs">
                                {getInitials(task.assigned_to_profile.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {task.assigned_to_profile.full_name || 'Unassigned'}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {columnTasks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No tasks
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectKanban;
