import { Card, CardContent } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your preferences
        </p>
      </div>

      <Card className="border-border shadow-medium">
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            Settings page coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
