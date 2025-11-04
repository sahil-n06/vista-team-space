import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TaskDetailDialog } from "./TaskDetail/task-detail-dialog";

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

interface TaskCardProps {
  task: any;
  tasks: any[];
  onClick: () => void;
}

function TaskCard({ task, tasks, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const subtasks = tasks.filter(t => t.parent_task_id === task.id);
  const completedSubtasks = subtasks.filter(t => t.status === 'completed').length;
  const checklistItems = task.task_checklist_items || [];
  const completedChecklist = checklistItems.filter((item: any) => item.completed).length;

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card 
        className={`hover-lift cursor-pointer transition-all ${priorityColors[task.priority as keyof typeof priorityColors]}`}
        onClick={onClick}
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
    </div>
  );
}

const ProjectKanban = ({ tasks, projectId }: ProjectKanbanProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status && !task.parent_task_id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as 'todo' | 'in_progress' | 'in_review' | 'completed' | 'blocked';

    // Find the task
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistically update the UI
    queryClient.setQueryData(['project-tasks', projectId], (old: any) => {
      if (!old) return old;
      return old.map((t: any) => 
        t.id === taskId ? { ...t, status: newStatus } : t
      );
    });

    // Update the database
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      toast.error("Failed to update task status");
      // Revert the optimistic update
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
    } else {
      toast.success("Task status updated");
    }
  };

  const activeTask = tasks.find(t => t.id === activeId);

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusColumns.map(column => {
            const columnTasks = getTasksByStatus(column.id);
            const Icon = column.icon;

            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                <SortableContext
                  items={columnTasks.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                  id={column.id}
                >
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
                      {columnTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          tasks={tasks}
                          onClick={() => setSelectedTask(task)}
                        />
                      ))}

                      {columnTasks.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No tasks
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <Card className={`w-80 opacity-90 ${priorityColors[activeTask.priority as keyof typeof priorityColors]}`}>
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm">{activeTask.title}</h4>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      )}
    </>
  );
};

export default ProjectKanban;
