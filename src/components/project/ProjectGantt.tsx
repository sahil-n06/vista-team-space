import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

interface ProjectGanttProps {
  tasks: any[];
}

const ProjectGantt = ({ tasks }: ProjectGanttProps) => {
  const tasksWithDates = tasks.filter(task => task.due_date && !task.parent_task_id);

  if (tasksWithDates.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">No tasks with due dates</p>
        </CardContent>
      </Card>
    );
  }

  const dates = tasksWithDates.map(task => new Date(task.due_date));
  const minDate = startOfMonth(new Date(Math.min(...dates.map(d => d.getTime()))));
  const maxDate = endOfMonth(new Date(Math.max(...dates.map(d => d.getTime()))));
  const daysBetween = differenceInDays(maxDate, minDate);
  const daysArray = eachDayOfInterval({ start: minDate, end: maxDate });

  const getTaskPosition = (task: any) => {
    const taskDate = new Date(task.due_date);
    const daysFromStart = differenceInDays(taskDate, minDate);
    return (daysFromStart / daysBetween) * 100;
  };

  return (
    <Card className="border-border shadow-soft">
      <CardHeader>
        <CardTitle>Timeline View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 overflow-x-auto">
          {/* Timeline header */}
          <div className="flex gap-1 mb-4 pb-2 border-b">
            {daysArray.map((day, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 text-xs text-center"
                style={{ width: `${100 / daysArray.length}%`, minWidth: '30px' }}
              >
                <div className="font-medium">{format(day, 'd')}</div>
                <div className="text-muted-foreground">{format(day, 'MMM')}</div>
              </div>
            ))}
          </div>

          {/* Task rows */}
          <div className="space-y-3">
            {tasksWithDates.map(task => {
              const position = getTaskPosition(task);
              const statusColors = {
                todo: 'bg-muted',
                in_progress: 'bg-primary',
                in_review: 'bg-accent',
                completed: 'bg-success',
                blocked: 'bg-destructive',
              };

              return (
                <div key={task.id} className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-48 flex-shrink-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-8 bg-muted/30 rounded-md overflow-hidden">
                    <div 
                      className={`absolute h-full rounded-md ${statusColors[task.status as keyof typeof statusColors]} transition-all`}
                      style={{ 
                        left: `${position}%`, 
                        width: '8%',
                        minWidth: '40px'
                      }}
                    >
                      <div className="px-2 py-1 text-xs text-white truncate">
                        {format(new Date(task.due_date), 'MMM d')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectGantt;
