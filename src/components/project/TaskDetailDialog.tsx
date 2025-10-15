import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Calendar as CalendarIcon,
  Paperclip,
  User,
  CheckSquare,
  MessageSquare,
  Clock,
  Tag,
  Send,
  Plus,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskDetailDialogProps {
  task: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {
  const [newComment, setNewComment] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(
    task.created_at ? new Date(task.created_at) : undefined
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.due_date ? new Date(task.due_date) : undefined
  );

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

  const mockComments = [
    {
      id: 1,
      user: "John Doe",
      avatar: "",
      content: "Started working on this task. Will update progress soon.",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      user: "Jane Smith",
      avatar: "",
      content: "Great! Let me know if you need any help with the implementation.",
      timestamp: "1 hour ago",
    },
  ];

  const mockFiles = [
    { id: 1, name: "design-mockup.pdf", size: "2.4 MB", uploadedBy: "John Doe" },
    { id: 2, name: "requirements.docx", size: "1.2 MB", uploadedBy: "Jane Smith" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <DialogTitle className="text-2xl">{task.title}</DialogTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getStatusColor(task.status)}>
                    {task.status?.replace("_", " ")}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <Separator />

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="checklist">Checklist</TabsTrigger>
                  <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Description
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {task.description || "No description provided"}
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Start Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Due Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dueDate}
                            onSelect={setDueDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Assignee */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Assignee
                    </h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.assigned_to_profile?.avatar_url} />
                        <AvatarFallback>
                          {task.assigned_to_profile?.full_name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("") || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {task.assigned_to_profile?.full_name || "Unassigned"}
                      </span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="checklist" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <CheckSquare className="h-4 w-4" />
                      Checklist Items
                    </h3>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {task.task_checklist_items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
                        <Checkbox checked={item.completed} />
                        <span className={cn("text-sm", item.completed && "line-through text-muted-foreground")}>
                          {item.title}
                        </span>
                      </div>
                    ))}
                    {(!task.task_checklist_items || task.task_checklist_items.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No checklist items yet
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="subtasks" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Subtasks</h3>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subtask
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {task.subtasks?.map((subtask: any) => (
                      <div key={subtask.id} className="p-3 border rounded-lg hover:bg-muted">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{subtask.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{subtask.description}</p>
                          </div>
                          <Badge className={getStatusColor(subtask.status)}>
                            {subtask.status?.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {(!task.subtasks || task.subtasks.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No subtasks yet
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="files" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      Attached Files
                    </h3>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {mockFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.size} • Uploaded by {file.uploadedBy}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Comments Section */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </h3>
                <div className="space-y-4">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>
                          {comment.user.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comment.user}</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button size="icon" className="shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
