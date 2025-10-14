import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, KanbanSquare, Calendar, BarChart3, Users } from "lucide-react";
import ProjectDashboard from "@/components/project/ProjectDashboard";
import ProjectKanban from "@/components/project/ProjectKanban";
import ProjectCalendar from "@/components/project/ProjectCalendar";
import ProjectGantt from "@/components/project/ProjectGantt";
import ProjectTeam from "@/components/project/ProjectTeam";

const Project = () => {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          organization:organizations(name, slug),
          tasks(
            *,
            assigned_to_profile:profiles!tasks_assigned_to_fkey(full_name, avatar_url),
            created_by_profile:profiles!tasks_created_by_fkey(full_name, avatar_url),
            task_checklist_items(*),
            subtasks:tasks!parent_task_id(*)
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">Project not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{project.organization?.name}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{project.name}</span>
        </div>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        {project.description && (
          <p className="text-muted-foreground mt-2">{project.description}</p>
        )}
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="dashboard" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="kanban" className="gap-2">
            <KanbanSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Kanban</span>
          </TabsTrigger>
          <TabsTrigger value="gantt" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Gantt</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ProjectDashboard project={project} />
        </TabsContent>

        <TabsContent value="kanban">
          <ProjectKanban tasks={project.tasks || []} projectId={project.id} />
        </TabsContent>

        <TabsContent value="gantt">
          <ProjectGantt tasks={project.tasks || []} />
        </TabsContent>

        <TabsContent value="calendar">
          <ProjectCalendar tasks={project.tasks || []} />
        </TabsContent>

        <TabsContent value="team">
          <ProjectTeam tasks={project.tasks || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Project;
