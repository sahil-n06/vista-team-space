import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WorksheetStatus = () => {
  const departments = [
    { name: "Reporting & Analytics", worksheets: 12 },
    { name: "Internal Ops", worksheets: 8 },
    { name: "Client Projects", worksheets: 15 },
  ];

  const sampleWorksheet = "68c7f5a38edbe34341adaffb";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Worksheet Status Management</CardTitle>
        <CardDescription>
          Manage and review statuses for worksheets across departments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {departments.map((dept) => (
              <div key={dept.name} className="p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                <p className="font-medium text-sm mb-1">{dept.name}</p>
                <p className="text-xs text-muted-foreground">{dept.worksheets} worksheets</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg border border-border bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Sample Worksheet ID</p>
            <code className="text-xs font-mono bg-background px-2 py-1 rounded">
              {sampleWorksheet}
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorksheetStatus;
