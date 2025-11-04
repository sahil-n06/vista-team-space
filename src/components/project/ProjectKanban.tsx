import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Circle, Clock, AlertCircle, Plus, X } from "lucide-react";
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
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { TaskDetailDialog } from "./TaskDetail/task-detail-dialog";

interface ProjectKanbanProps {
  tasks: any[];
  projectId: string;
}

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
              <div className="flex -space-x-2">
                <Avatar className="h-6 w-6 ring-2 ring-background">
                  <AvatarImage src={task.assigned_to_profile.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {getInitials(task.assigned_to_profile.full_name)}
                  </AvatarFallback>
                </Avatar>
              </div>
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
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [selectedStatusForTask, setSelectedStatusForTask] = useState<string>("");
  const [newStatusDialogOpen, setNewStatusDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newStatusName, setNewStatusName] = useState("");
  const [newStatusColor, setNewStatusColor] = useState("#3b82f6");
  const queryClient = useQueryClient();

  const { data: statuses = [], isLoading: statusesLoading } = useQuery({
    queryKey: ["statuses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("statuses")
        .select("*")
        .order("position");
      if (error) throw error;
      return data;
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (values: { title: string; description: string; status: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("tasks").insert([{
        title: values.title,
        description: values.description,
        status: values.status as any,
        project_id: projectId,
        created_by: user?.id,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
      toast.success("Task created successfully");
      setNewTaskDialogOpen(false);
      setNewTaskTitle("");
      setNewTaskDescription("");
    },
    onError: (error) => {
      toast.error("Failed to create task: " + error.message);
    },
  });

  const createStatusMutation = useMutation({
    mutationFn: async (values: { name: string; color: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("statuses").insert([{
        name: values.name,
        color: values.color,
        type: "custom",
        is_editable: true,
        position: statuses.length,
        created_by: user?.id,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statuses"] });
      toast.success("Status created successfully");
      setNewStatusDialogOpen(false);
      setNewStatusName("");
      setNewStatusColor("#3b82f6");
    },
    onError: (error) => {
      toast.error("Failed to create status: " + error.message);
    },
  });

  const deleteStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("statuses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statuses"] });
      toast.success("Status removed successfully");
    },
    onError: (error) => {
      toast.error("Failed to remove status: " + error.message);
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getTasksByStatus = (statusName: string) => {
    return tasks.filter(task => task.status === statusName && !task.parent_task_id);
  };

  const lightenColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.floor(((num >> 16) & 0xff) + (255 - ((num >> 16) & 0xff)) * percent));
    const g = Math.min(255, Math.floor(((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * percent));
    const b = Math.min(255, Math.floor((num & 0xff) + (255 - (num & 0xff)) * percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const handleOpenTaskDialog = (statusName: string) => {
    setSelectedStatusForTask(statusName);
    setNewTaskDialogOpen(true);
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("Task title is required");
      return;
    }
    createTaskMutation.mutate({
      title: newTaskTitle,
      description: newTaskDescription,
      status: selectedStatusForTask,
    });
  };

  const handleCreateStatus = () => {
    if (!newStatusName.trim()) {
      toast.error("Status name is required");
      return;
    }
    createStatusMutation.mutate({
      name: newStatusName,
      color: newStatusColor,
    });
  };

  const handleDeleteStatus = (id: string) => {
    if (confirm("Are you sure you want to remove this status column?")) {
      deleteStatusMutation.mutate(id);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

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
      .update({ status: newStatus as any })
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

  if (statusesLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading statuses...</div>;
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statuses.map(status => {
            const columnTasks = getTasksByStatus(status.name);
            const lightColor = lightenColor(status.color, 0.9);

            return (
              <div key={status.id} className="flex-shrink-0 w-80">
                <SortableContext
                  items={columnTasks.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                  id={status.name}
                >
                  <Card className="border-border shadow-soft h-full" style={{ backgroundColor: lightColor }}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: status.color }}
                          />
                          <span>{status.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{columnTasks.length}</Badge>
                          {status.is_editable && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDeleteStatus(status.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
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
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No tasks
                        </p>
                      )}

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleOpenTaskDialog(status.name)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </CardContent>
                  </Card>
                </SortableContext>
              </div>
            );
          })}

          {/* Add Status Column */}
          <div className="flex-shrink-0 w-80">
            <Card className="border-dashed border-2 border-muted-foreground/30 h-full">
              <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                <Button
                  variant="ghost"
                  className="w-full h-full"
                  onClick={() => setNewStatusDialogOpen(true)}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Status
                </Button>
              </CardContent>
            </Card>
          </div>
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

      {/* Task Creation Dialog */}
      <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to {selectedStatusForTask}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Task description (optional)"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} disabled={createTaskMutation.isPending}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Creation Dialog */}
      <Dialog open={newStatusDialogOpen} onOpenChange={setNewStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Status</DialogTitle>
            <DialogDescription>
              Add a new status column to your board
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status-name">Status Name</Label>
              <Input
                id="status-name"
                placeholder="e.g., In Review"
                value={newStatusName}
                onChange={(e) => setNewStatusName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status-color">Color</Label>
              <Input
                id="status-color"
                type="color"
                value={newStatusColor}
                onChange={(e) => setNewStatusColor(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateStatus} disabled={createStatusMutation.isPending}>
              Create Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
