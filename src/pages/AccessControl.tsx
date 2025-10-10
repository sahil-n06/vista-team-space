import { Card, CardContent } from "@/components/ui/card";

const AccessControl = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Access Control</h1>
        <p className="text-muted-foreground">
          Manage roles and permissions
        </p>
      </div>

      <Card className="border-border shadow-medium">
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            Access control management coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessControl;
