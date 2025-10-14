import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format, isSameDay } from "date-fns";

interface ProjectCalendarProps {
  tasks: any[];
}

const ProjectCalendar = ({ tasks }: ProjectCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const tasksWithDates = tasks.filter(task => task.due_date);
  
  const tasksOnSelectedDate = selectedDate
    ? tasksWithDates.filter(task => 
        isSameDay(new Date(task.due_date), selectedDate)
      )
    : [];

  const datesWithTasks = tasksWithDates.map(task => new Date(task.due_date));

  const priorityColors = {
    urgent: 'border-l-destructive bg-destructive/5',
    high: 'border-l-orange-500 bg-orange-500/5',
    medium: 'border-l-primary bg-primary/5',
    low: 'border-l-muted-foreground bg-muted',
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasTask: datesWithTasks,
            }}
            modifiersStyles={{
              hasTask: {
                fontWeight: 'bold',
                textDecoration: 'underline',
                color: 'hsl(var(--primary))',
              },
            }}
          />
        </CardContent>
      </Card>

      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasksOnSelectedDate.length > 0 ? (
            <div className="space-y-3">
              {tasksOnSelectedDate.map(task => (
                <Card 
                  key={task.id}
                  className={`border-l-4 ${priorityColors[task.priority as keyof typeof priorityColors]}`}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">{task.title}</h4>
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      {task.assigned_to_profile && (
                        <p className="text-xs text-muted-foreground">
                          Assigned to: {task.assigned_to_profile.full_name}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No tasks scheduled for this date
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCalendar;
