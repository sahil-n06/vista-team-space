import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarIcon, Clock, Tag, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskDetailOverviewProps {
  task: any;
}

export function TaskDetailOverview({ task }: TaskDetailOverviewProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    task.created_at ? new Date(task.created_at) : undefined
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.due_date ? new Date(task.due_date) : undefined
  );

  return (
    <div className="space-y-6 mt-6">
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
    </div>
  );
}
