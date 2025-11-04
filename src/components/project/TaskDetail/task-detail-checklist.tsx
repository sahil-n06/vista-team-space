import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDetailChecklistProps {
  task: any;
}

export function TaskDetailChecklist({ task }: TaskDetailChecklistProps) {
  return (
    <div className="space-y-4 mt-6">
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
    </div>
  );
}
