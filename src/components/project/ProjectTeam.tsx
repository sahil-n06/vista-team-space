import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users } from "lucide-react";

interface ProjectTeamProps {
  tasks: any[];
}

const ProjectTeam = ({ tasks }: ProjectTeamProps) => {
  // Group tasks by assignee
  const tasksByAssignee = tasks.reduce((acc: any, task) => {
    if (!task.assigned_to) return acc;
    
    if (!acc[task.assigned_to]) {
      acc[task.assigned_to] = {
        profile: task.assigned_to_profile,
        tasks: [],
      };
    }
    acc[task.assigned_to].tasks.push(task);
    return acc;
  }, {});

  const teamMembers = Object.values(tasksByAssignee);

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getWorkloadStats = (memberTasks: any[]) => {
    return {
      total: memberTasks.length,
      completed: memberTasks.filter(t => t.status === 'completed').length,
      inProgress: memberTasks.filter(t => t.status === 'in_progress').length,
      urgent: memberTasks.filter(t => t.priority === 'urgent').length,
      high: memberTasks.filter(t => t.priority === 'high').length,
    };
  };

  if (teamMembers.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-2">
            <Users className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">No team members assigned yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {teamMembers.map((member: any, index) => {
        const stats = getWorkloadStats(member.tasks);
        const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
        
        return (
          <Card key={index} className="border-border shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.profile?.avatar_url} />
                  <AvatarFallback>
                    {getInitials(member.profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-base">
                    {member.profile?.full_name || 'Unknown'}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {stats.total} tasks assigned
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Completion Rate</span>
                  <span className="font-medium">{Math.round(completionRate)}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-primary/10 p-3">
                  <p className="text-xs text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-primary">{stats.inProgress}</p>
                </div>
                <div className="rounded-lg bg-success/10 p-3">
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">{stats.completed}</p>
                </div>
              </div>

              {(stats.urgent > 0 || stats.high > 0) && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-xs font-medium text-muted-foreground">Priority Tasks</p>
                  <div className="flex items-center gap-2">
                    {stats.urgent > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {stats.urgent} Urgent
                      </Badge>
                    )}
                    {stats.high > 0 && (
                      <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30 text-xs">
                        {stats.high} High
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t">
                <p className="text-xs font-medium mb-2">Recent Tasks</p>
                <div className="space-y-1">
                  {member.tasks.slice(0, 3).map((task: any) => (
                    <div key={task.id} className="text-xs text-muted-foreground truncate">
                      • {task.title}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProjectTeam;
