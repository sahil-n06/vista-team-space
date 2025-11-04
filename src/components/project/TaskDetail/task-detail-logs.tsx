import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { getStatusColor, formatStatusName } from "./task-detail-utils";
import type { TaskLog } from "./task-detail-types";

interface TaskDetailLogsProps {
  task: any;
}

const mockTaskLogs: TaskLog[] = [
  {
    id: 1,
    status: "Pending",
    fromStatus: "Pending",
    toStatus: "Start",
    date: "Sep 29, 2025",
    changedBy: "tussle duper",
    avatar: "",
  },
  {
    id: 2,
    status: "Start",
    fromStatus: "Start",
    toStatus: "Done",
    date: "Sep 29, 2025",
    changedBy: "tussle duper",
    avatar: "",
  },
];

export function TaskDetailLogs({ task }: TaskDetailLogsProps) {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4" />
        <h3 className="text-sm font-semibold">Status History</h3>
      </div>
      
      <div className="space-y-4">
        {mockTaskLogs.map((log, index) => (
          <div key={log.id} className="relative pl-8 pb-6 last:pb-0">
            {/* Timeline line */}
            {index < mockTaskLogs.length - 1 && (
              <div className="absolute left-3 top-6 bottom-0 w-px bg-border" />
            )}
            
            {/* Timeline dot */}
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getStatusColor(log.fromStatus || log.status)}>
                  {formatStatusName(log.fromStatus || log.status)}
                </Badge>
                {log.toStatus && (
                  <>
                    <span className="text-xs text-muted-foreground">→</span>
                    <Badge className={getStatusColor(log.toStatus)}>
                      {formatStatusName(log.toStatus)}
                    </Badge>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={log.avatar} />
                  <AvatarFallback className="text-xs">
                    {log.changedBy.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-xs text-muted-foreground">
                  Changed by <span className="font-medium text-foreground">{log.changedBy}</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">{log.date}</p>
            </div>
          </div>
        ))}
        
        {mockTaskLogs.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No status changes yet
          </p>
        )}
      </div>
    </div>
  );
}
