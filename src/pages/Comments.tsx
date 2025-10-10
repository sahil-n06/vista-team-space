import { Card, CardContent } from "@/components/ui/card";

const Comments = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Comments</h1>
        <p className="text-muted-foreground">
          Comments you've made across all tasks
        </p>
      </div>

      <Card className="border-border shadow-medium">
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            Comments functionality coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Comments;
