import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";
import { format } from "date-fns";

const Clients = () => {
  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Card
              key={org.id}
              className="hover-lift border-border shadow-soft cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      @{org.slug}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {org.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {org.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Created {format(new Date(org.created_at), "MMM dd, yyyy")}
                </p>
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
