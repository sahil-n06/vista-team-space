import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, Legend } from "recharts";

const Reports = () => {
  // Dummy data for charts
  const taskCompletionData = [
    { month: "Jan", completed: 45, pending: 12, blocked: 3 },
    { month: "Feb", completed: 52, pending: 8, blocked: 2 },
    { month: "Mar", completed: 61, pending: 15, blocked: 4 },
    { month: "Apr", completed: 58, pending: 10, blocked: 1 },
    { month: "May", completed: 70, pending: 9, blocked: 2 },
    { month: "Jun", completed: 65, pending: 14, blocked: 3 },
  ];

  const projectStatusData = [
    { name: "Completed", value: 45, color: "hsl(var(--success))" },
    { name: "In Progress", value: 30, color: "hsl(var(--primary))" },
    { name: "Planning", value: 15, color: "hsl(var(--warning))" },
    { name: "On Hold", value: 10, color: "hsl(var(--muted))" },
  ];

  const teamPerformanceData = [
    { name: "Design Team", efficiency: 92, tasks: 156 },
    { name: "Development", efficiency: 88, tasks: 203 },
    { name: "Marketing", efficiency: 85, tasks: 134 },
    { name: "Sales", efficiency: 90, tasks: 98 },
    { name: "Support", efficiency: 87, tasks: 267 },
  ];

  const weeklyActivityData = [
    { day: "Mon", hours: 8, tasks: 12 },
    { day: "Tue", hours: 7.5, tasks: 15 },
    { day: "Wed", hours: 9, tasks: 18 },
    { day: "Thu", hours: 8.5, tasks: 14 },
    { day: "Fri", hours: 7, tasks: 10 },
    { day: "Sat", hours: 3, tasks: 5 },
    { day: "Sun", hours: 2, tasks: 3 },
  ];

  const stats = [
    {
      title: "Total Tasks",
      value: "487",
      change: "+12.5%",
      icon: CheckCircle2,
      color: "text-success",
    },
    {
      title: "Active Projects",
      value: "24",
      change: "+3",
      icon: BarChart3,
      color: "text-primary",
    },
    {
      title: "Team Members",
      value: "32",
      change: "+2",
      icon: Users,
      color: "text-accent",
    },
    {
      title: "Avg. Completion Time",
      value: "3.2 days",
      change: "-8%",
      icon: Clock,
      color: "text-warning",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights and performance metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-border shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs for different report views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border shadow-soft">
              <CardHeader>
                <CardTitle>Task Completion Trends</CardTitle>
                <CardDescription>Monthly task completion statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    completed: {
                      label: "Completed",
                      color: "hsl(var(--success))",
                    },
                    pending: {
                      label: "Pending",
                      color: "hsl(var(--warning))",
                    },
                    blocked: {
                      label: "Blocked",
                      color: "hsl(var(--destructive))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pending" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="blocked" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-border shadow-soft">
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
                <CardDescription>Current project status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Projects",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {projectStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle>Project Progress Overview</CardTitle>
              <CardDescription>Track progress across all active projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Website Redesign", progress: 75, status: "On Track" },
                  { name: "Mobile App Development", progress: 45, status: "At Risk" },
                  { name: "Marketing Campaign", progress: 90, status: "On Track" },
                  { name: "Infrastructure Upgrade", progress: 30, status: "Behind" },
                ].map((project) => (
                  <div key={project.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-muted-foreground">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className={`text-xs ${
                      project.status === "On Track" ? "text-success" :
                      project.status === "At Risk" ? "text-warning" :
                      "text-destructive"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle>Team Performance Metrics</CardTitle>
              <CardDescription>Efficiency and task completion by team</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  efficiency: {
                    label: "Efficiency %",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="efficiency" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Hours worked and tasks completed this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  hours: {
                    label: "Hours",
                    color: "hsl(var(--primary))",
                  },
                  tasks: {
                    label: "Tasks",
                    color: "hsl(var(--success))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tasks"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--success))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
