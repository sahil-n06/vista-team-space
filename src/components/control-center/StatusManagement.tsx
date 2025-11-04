import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const StatusManagement = () => {
  const statuses = [
    { name: "Pending", color: "bg-yellow-500", subStatuses: [] },
    { name: "Start", color: "bg-blue-500", subStatuses: [] },
    { name: "In Progress", color: "bg-purple-500", subStatuses: ["Internal Approval", "Client Approval"] },
    { name: "Done", color: "bg-green-500", subStatuses: [] },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Management</CardTitle>
        <CardDescription>
          Create and manage status types for your workflow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statuses.map((status) => (
            <div key={status.name} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
              <div className={`w-3 h-3 rounded-full ${status.color} mt-1.5 flex-shrink-0`} />
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">{status.name}</p>
                {status.subStatuses.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {status.subStatuses.map((sub) => (
                      <Badge key={sub} variant="secondary" className="text-xs">
                        {sub}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusManagement;
