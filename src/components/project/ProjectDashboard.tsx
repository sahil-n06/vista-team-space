import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Users, ListChecks } from "lucide-react";

interface ProjectDashboardProps {
  project: any;
}

const ProjectDashboard = ({ project }: ProjectDashboardProps) => {
  const tasks = project.tasks || [];
  
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t: any) => t.status === 'completed').length,
    inProgress: tasks.filter((t: any) => t.status === 'in_progress').length,
    todo: tasks.filter((t: any) => t.status === 'todo').length,
    blocked: tasks.filter((t: any) => t.status === 'blocked').length,
    inReview: tasks.filter((t: any) => t.status === 'in_review').length,
  };

  const progressPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const priorityCount = {
    urgent: tasks.filter((t: any) => t.priority === 'urgent').length,
    high: tasks.filter((t: any) => t.priority === 'high').length,
    medium: tasks.filter((t: any) => t.priority === 'medium').length,
    low: tasks.filter((t: any) => t.priority === 'low').length,
  };

  const totalChecklistItems = tasks.reduce((sum: number, task: any) => {
    return sum + (task.task_checklist_items?.length || 0);
  }, 0);

  const completedChecklistItems = tasks.reduce((sum: number, task: any) => {
    return sum + (task.task_checklist_items?.filter((item: any) => item.completed).length || 0);
  }, 0);

  const checklistProgress = totalChecklistItems > 0 
    ? (completedChecklistItems / totalChecklistItems) * 100 
    : 0;

  const uniqueAssignees = new Set(
    tasks.filter((t: any) => t.assigned_to).map((t: any) => t.assigned_to)
  ).size;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <Progress value={progressPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completed} completed ({Math.round(progressPercentage)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.inReview} in review
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.todo} remaining
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueAssignees}</div>
            <p className="text-xs text-muted-foreground mt-2">Active contributors</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">To Do</span>
                <Badge variant="secondary">{stats.todo}</Badge>
              </div>
              <Progress value={(stats.todo / stats.total) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">In Progress</span>
                <Badge variant="default">{stats.inProgress}</Badge>
              </div>
              <Progress value={(stats.inProgress / stats.total) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">In Review</span>
                <Badge variant="outline">{stats.inReview}</Badge>
              </div>
              <Progress value={(stats.inReview / stats.total) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <Badge className="bg-success text-success-foreground">{stats.completed}</Badge>
              </div>
              <Progress value={(stats.completed / stats.total) * 100} className="h-2" />
            </div>

            {stats.blocked > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Blocked</span>
                  <Badge variant="destructive">{stats.blocked}</Badge>
                </div>
                <Progress value={(stats.blocked / stats.total) * 100} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle>Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium">Urgent</span>
              </div>
              <Badge variant="destructive">{priorityCount.urgent}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium">High</span>
              </div>
              <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30">
                {priorityCount.high}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Medium</span>
              </div>
              <Badge variant="default">{priorityCount.medium}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Low</span>
              </div>
              <Badge variant="secondary">{priorityCount.low}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checklist Progress */}
      {totalChecklistItems > 0 && (
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle>Overall Checklist Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{completedChecklistItems} of {totalChecklistItems} items completed</span>
                <span className="font-medium">{Math.round(checklistProgress)}%</span>
              </div>
              <Progress value={checklistProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectDashboard;
