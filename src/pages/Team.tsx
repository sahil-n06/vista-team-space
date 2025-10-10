import { Card, CardContent } from "@/components/ui/card";

const Team = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Team</h1>
        <p className="text-muted-foreground">
          Manage team members and collaborators
        </p>
      </div>

      <Card className="border-border shadow-medium">
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            Team management coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Team;
