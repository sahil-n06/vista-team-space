import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { getStatusColor, formatStatusName } from "./task-detail-utils";

interface TaskDetailSubtasksProps {
  task: any;
}

export function TaskDetailSubtasks({ task }: TaskDetailSubtasksProps) {
  return (
    <div className="space-y-4 mt-6">
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
                {formatStatusName(subtask.status)}
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
    </div>
  );
}
