import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Folder, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Clients = () => {
  const navigate = useNavigate();
  
  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select(`
          *,
          projects (
            id,
            name,
            status,
            start_date,
            end_date
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Clients</h1>
        <p className="text-muted-foreground">
          Manage your organizations and clients
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : organizations && organizations.length > 0 ? (
        <div className="space-y-6">
          {organizations.map((org: any) => (
            <Card key={org.id} className="border-border shadow-soft overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{org.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {org.description || `@${org.slug}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {org.projects?.length || 0} Projects
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {org.projects && org.projects.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {org.projects.map((project: any) => (
                      <Card
                        key={project.id}
                        className="hover-lift cursor-pointer transition-all border-border/50"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                              <Folder className="h-5 w-5 text-accent-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">{project.name}</h4>
                              <Badge 
                                variant={project.status === 'active' ? 'default' : 'secondary'}
                                className="mt-1 text-xs"
                              >
                                {project.status}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              {project.start_date && format(new Date(project.start_date), "MMM dd")}
                            </span>
                            <ArrowRight className="h-3 w-3" />
                            <span>
                              {project.end_date && format(new Date(project.end_date), "MMM dd, yyyy")}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No projects yet
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border shadow-medium">
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              No organizations yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Clients;
