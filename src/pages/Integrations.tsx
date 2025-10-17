import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle2, 
  Circle, 
  Download, 
  Plug, 
  RefreshCw,
  Zap,
  DollarSign,
  TrendingUp,
  FileText,
  Calendar,
  ListChecks
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  category: "task" | "accounting" | "marketing";
  description: string;
  icon: any;
  connected: boolean;
  lastSync?: string;
}

const integrations: Integration[] = [
  {
    id: "asana",
    name: "Asana",
    category: "task",
    description: "Migrate tasks, projects, and team data from Asana",
    icon: ListChecks,
    connected: false,
  },
  {
    id: "clickup",
    name: "ClickUp",
    category: "task",
    description: "Import all your ClickUp workspaces, tasks, and dashboards",
    icon: CheckCircle2,
    connected: false,
  },
  {
    id: "jira",
    name: "Jira",
    category: "task",
    description: "Migrate Jira issues, sprints, and project boards",
    icon: Circle,
    connected: false,
  },
  {
    id: "planner",
    name: "Microsoft Planner",
    category: "task",
    description: "Import plans, tasks, and buckets from Microsoft Planner",
    icon: Calendar,
    connected: false,
  },
  {
    id: "todo",
    name: "Microsoft To-Do",
    category: "task",
    description: "Migrate your to-do lists and tasks",
    icon: FileText,
    connected: false,
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    category: "accounting",
    description: "Connect accounting data and financial reports",
    icon: DollarSign,
    connected: false,
  },
  {
    id: "xero",
    name: "Xero",
    category: "accounting",
    description: "Sync invoices, expenses, and financial data",
    icon: DollarSign,
    connected: false,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "marketing",
    description: "Import marketing campaigns and analytics",
    icon: TrendingUp,
    connected: false,
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    category: "marketing",
    description: "Connect email campaigns and subscriber data",
    icon: Zap,
    connected: false,
  },
];

export default function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [isMigrating, setIsMigrating] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setApiKey("");
    setMigrationProgress(0);
    setIsMigrating(false);
  };

  const handleMigrate = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key to continue",
        variant: "destructive",
      });
      return;
    }

    setIsMigrating(true);
    
    // Simulate migration progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setMigrationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsMigrating(false);
        toast({
          title: "Migration Complete!",
          description: `Successfully migrated data from ${selectedIntegration?.name}`,
        });
        setTimeout(() => {
          setSelectedIntegration(null);
        }, 1500);
      }
    }, 500);
  };

  const categoryLabels = {
    task: "Task Management",
    accounting: "Accounting & Finance",
    marketing: "Marketing & Analytics",
  };

  const getCategoryIntegrations = (category: "task" | "accounting" | "marketing") => {
    return integrations.filter(int => int.category === category);
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Integration Hub</h1>
        <p className="text-muted-foreground">
          Connect and migrate your data from popular task management, accounting, and marketing tools
        </p>
      </div>

      {/* Task Management Integrations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">{categoryLabels.task}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getCategoryIntegrations("task").map((integration) => (
            <Card key={integration.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <integration.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      {integration.connected && (
                        <Badge variant="secondary" className="mt-1">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {integration.connected ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Last sync: {integration.lastSync || "Just now"}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Now
                      </Button>
                      <Button size="sm" variant="ghost">
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => handleConnect(integration)} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Migrate Data
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Accounting Integrations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">{categoryLabels.accounting}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getCategoryIntegrations("accounting").map((integration) => (
            <Card key={integration.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <integration.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      {integration.connected && (
                        <Badge variant="secondary" className="mt-1">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleConnect(integration)} className="w-full">
                  <Plug className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Marketing Integrations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">{categoryLabels.marketing}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getCategoryIntegrations("marketing").map((integration) => (
            <Card key={integration.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <integration.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      {integration.connected && (
                        <Badge variant="secondary" className="mt-1">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleConnect(integration)} className="w-full">
                  <Plug className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Migration Dialog */}
      <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedIntegration?.category === "task" ? "Migrate" : "Connect"} {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedIntegration?.category === "task" 
                ? "Enter your API credentials to start migrating your tasks, projects, and dashboards."
                : "Enter your API credentials to connect this integration."}
            </DialogDescription>
          </DialogHeader>
          
          {!isMigrating ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key / Access Token</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace / Organization ID (optional)</Label>
                <Input
                  id="workspace"
                  placeholder="Enter workspace ID"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleMigrate} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  {selectedIntegration?.category === "task" ? "Start Migration" : "Connect"}
                </Button>
                <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-6">
              <div className="text-center space-y-2">
                <RefreshCw className="h-12 w-12 mx-auto animate-spin text-primary" />
                <p className="text-lg font-semibold">Migrating Data...</p>
                <p className="text-sm text-muted-foreground">
                  This may take a few minutes depending on your data size
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-semibold">{migrationProgress}%</span>
                </div>
                <Progress value={migrationProgress} className="h-2" />
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <p>✓ Connecting to {selectedIntegration?.name}...</p>
                {migrationProgress > 20 && <p>✓ Fetching workspaces and projects...</p>}
                {migrationProgress > 40 && <p>✓ Importing tasks...</p>}
                {migrationProgress > 60 && <p>✓ Syncing team members...</p>}
                {migrationProgress > 80 && <p>✓ Finalizing migration...</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
