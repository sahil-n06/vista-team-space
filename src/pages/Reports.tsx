import { Card, CardContent } from "@/components/ui/card";

const Reports = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-muted-foreground">
          Analytics and performance overview
        </p>
      </div>

      <Card className="border-border shadow-medium">
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            Reports and analytics coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
