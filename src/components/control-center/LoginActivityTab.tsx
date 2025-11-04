import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const LoginActivityTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["login_sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("login_sessions")
        .select("*")
        .order("login_at", { ascending: false });
      if (error) throw error;
      
      // Fetch user profiles separately
      const userIds = [...new Set(data.map(s => s.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);
      
      // Merge profiles with sessions
      return data.map(session => ({
        ...session,
        profile: profiles?.find(p => p.id === session.user_id)
      }));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from("login_sessions")
        .update({ is_active: false })
        .eq("id", sessionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["login_sessions"] });
      toast({ title: "Session logged out successfully" });
    },
    onError: (error) => {
      toast({ title: "Error logging out session", description: error.message, variant: "destructive" });
    },
  });

  const handleLogout = (sessionId: string) => {
    if (confirm("Are you sure you want to log out this session?")) {
      logoutMutation.mutate(sessionId);
    }
  };

  const filteredSessions = sessions?.filter((session) => {
    const matchesSearch =
      session.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.ip_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDevice = deviceFilter === "all" || session.device?.toLowerCase().includes(deviceFilter.toLowerCase());

    return matchesSearch && matchesDevice;
  });

  const activeSessions = sessions?.filter((s) => s.is_active) || [];
  const todaySessions = sessions?.filter((s) => {
    const loginDate = new Date(s.login_at);
    const today = new Date();
    return loginDate.toDateString() === today.toDateString();
  }) || [];

  const metrics = {
    totalLogins: sessions?.length || 0,
    activeUsers: new Set(activeSessions.map((s) => s.user_id)).size,
    todayLogins: todaySessions.length,
    failedLogins: 0, // Would need separate tracking
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login Activity Monitor</CardTitle>
        <CardDescription>Track and monitor user login sessions and security events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border bg-card text-center">
            <p className="text-2xl font-bold text-primary">{metrics.totalLogins}</p>
            <p className="text-xs text-muted-foreground">Total Logins</p>
          </div>
          <div className="p-4 rounded-lg border bg-card text-center">
            <p className="text-2xl font-bold text-primary">{metrics.activeUsers}</p>
            <p className="text-xs text-muted-foreground">Active Users</p>
          </div>
          <div className="p-4 rounded-lg border bg-card text-center">
            <p className="text-2xl font-bold text-primary">{metrics.todayLogins}</p>
            <p className="text-xs text-muted-foreground">Today's Logins</p>
          </div>
          <div className="p-4 rounded-lg border bg-card text-center">
            <p className="text-2xl font-bold text-primary">{metrics.failedLogins}</p>
            <p className="text-xs text-muted-foreground">Failed Logins</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, IP, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={deviceFilter} onValueChange={setDeviceFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by device" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Devices</SelectItem>
              <SelectItem value="chrome">Chrome</SelectItem>
              <SelectItem value="safari">Safari</SelectItem>
              <SelectItem value="firefox">Firefox</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : filteredSessions?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No login sessions found</div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Login Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions?.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.profile?.full_name || "Unknown User"}
                    </TableCell>
                    <TableCell className="text-sm">{session.device || "Unknown"}</TableCell>
                    <TableCell className="text-sm">{session.location || "Unknown"}</TableCell>
                    <TableCell className="text-sm font-mono">{session.ip_address || "N/A"}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(session.login_at), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={session.is_active ? "default" : "secondary"}>
                        {session.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {session.is_active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLogout(session.id)}
                          disabled={logoutMutation.isPending}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginActivityTab;
