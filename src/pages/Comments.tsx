import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const dummyComments = [
  {
    id: "1",
    content: "This task looks great! I've reviewed the requirements and everything seems clear.",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: { full_name: "John Doe", avatar_url: null },
    task: { title: "Design Homepage Mockup", status: "in_progress" }
  },
  {
    id: "2",
    content: "Can we schedule a meeting to discuss the implementation details? I have some questions about the API integration.",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    user: { full_name: "Sarah Smith", avatar_url: null },
    task: { title: "API Integration", status: "todo" }
  },
  {
    id: "3",
    content: "Completed the initial testing. Found a few minor issues that need to be addressed before we can move forward.",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: { full_name: "Mike Johnson", avatar_url: null },
    task: { title: "QA Testing Phase 1", status: "done" }
  },
  {
    id: "4",
    content: "Updated the documentation as requested. Please review when you have a chance.",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    user: { full_name: "Emily Davis", avatar_url: null },
    task: { title: "Update Documentation", status: "done" }
  },
  {
    id: "5",
    content: "This is blocking progress on other tasks. We need to prioritize this ASAP.",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    user: { full_name: "John Doe", avatar_url: null },
    task: { title: "Fix Critical Bug", status: "in_progress" }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "done":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "in_progress":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const Comments = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Comments</h1>
        <p className="text-muted-foreground">
          Comments you've made across all tasks
        </p>
      </div>

      <div className="space-y-4">
        {dummyComments.map((comment) => (
          <Card key={comment.id} className="border-border shadow-medium hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {comment.user.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{comment.user.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(comment.task.status)}>
                  {comment.task.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                On task: <span className="text-foreground font-medium">{comment.task.title}</span>
              </p>
              <p className="text-foreground">{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Comments;
