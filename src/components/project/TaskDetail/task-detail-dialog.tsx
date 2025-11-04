import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TaskDetailHeader } from "./task-detail-header";
import { TaskDetailOverview } from "./task-detail-overview";
import { TaskDetailChecklist } from "./task-detail-checklist";
import { TaskDetailSubtasks } from "./task-detail-subtasks";
import { TaskDetailFiles } from "./task-detail-files";
import { TaskDetailComments } from "./task-detail-comments";
import { TaskDetailLogs } from "./task-detail-logs";
import type { TaskDetailDialogProps } from "./task-detail-types";

export function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="flex flex-col h-full">
          <TaskDetailHeader task={task} onClose={() => onOpenChange(false)} />
          
          <Separator />

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="checklist">Checklist</TabsTrigger>
                  <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <TaskDetailOverview task={task} />
                </TabsContent>

                <TabsContent value="checklist">
                  <TaskDetailChecklist task={task} />
                </TabsContent>

                <TabsContent value="subtasks">
                  <TaskDetailSubtasks task={task} />
                </TabsContent>

                <TabsContent value="files">
                  <TaskDetailFiles task={task} />
                </TabsContent>

                <TabsContent value="logs">
                  <TaskDetailLogs task={task} />
                </TabsContent>
              </Tabs>

              <TaskDetailComments task={task} />
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
