import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getPriorityColor, getStatusColor, formatStatusName } from "./task-detail-utils";

interface TaskDetailHeaderProps {
  task: any;
  onClose: () => void;
}

export function TaskDetailHeader({ task, onClose }: TaskDetailHeaderProps) {
  return (
    <DialogHeader className="p-6 pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <DialogTitle className="text-2xl">{task.title}</DialogTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getStatusColor(task.status)}>
              {formatStatusName(task.status)}
            </Badge>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </DialogHeader>
  );
}
