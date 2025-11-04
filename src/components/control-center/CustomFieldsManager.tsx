import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const CustomFieldsManager = () => {
  const stats = [
    { label: "Active Fields", value: "3" },
    { label: "Fields with Options", value: "0" },
    { label: "Unique Field Types", value: "3" },
  ];

  const fields = [
    { name: "Budget", type: "Number", created: "Oct 15, 2024" },
    { name: "Deadline", type: "Date", created: "Oct 10, 2024" },
    { name: "Description", type: "Text", created: "Oct 5, 2024" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Fields Manager</CardTitle>
        <CardDescription>
          Manage, create, and organize your custom form fields easily.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="p-4 rounded-lg border border-border bg-card text-center">
                <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field) => (
                  <TableRow key={field.name}>
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{field.type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {field.created}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomFieldsManager;
