import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const LoginActivityMonitor = () => {
  const metrics = [
    { label: "Total Logins", value: "247" },
    { label: "Active Users", value: "7" },
    { label: "Today's Logins", value: "1" },
    { label: "Failed Logins", value: "3" },
  ];

  const loginData = [
    { user: "John Doe", device: "Chrome/Windows", location: "New York, US", ip: "192.168.1.1", status: "success" },
    { user: "Jane Smith", device: "Safari/MacOS", location: "London, UK", ip: "192.168.1.2", status: "success" },
    { user: "Bob Johnson", device: "Firefox/Linux", location: "Tokyo, JP", ip: "192.168.1.3", status: "failed" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login Activity Monitor</CardTitle>
        <CardDescription>
          Track and monitor user login sessions and security events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="p-4 rounded-lg border border-border bg-card text-center">
                <p className="text-2xl font-bold text-primary mb-1">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginData.map((login, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{login.user}</TableCell>
                    <TableCell className="text-sm">{login.device}</TableCell>
                    <TableCell className="text-sm">{login.location}</TableCell>
                    <TableCell className="text-sm font-mono">{login.ip}</TableCell>
                    <TableCell>
                      <Badge variant={login.status === "success" ? "default" : "destructive"}>
                        {login.status}
                      </Badge>
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

export default LoginActivityMonitor;
