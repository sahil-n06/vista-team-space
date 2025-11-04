import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";

interface TaskDetailCommentsProps {
  task: any;
}

const mockComments = [
  {
    id: 1,
    user: "John Doe",
    avatar: "",
    content: "Started working on this task. Will update progress soon.",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    user: "Jane Smith",
    avatar: "",
    content: "Great! Let me know if you need any help with the implementation.",
    timestamp: "1 hour ago",
  },
];

export function TaskDetailComments({ task }: TaskDetailCommentsProps) {
  const [newComment, setNewComment] = useState("");

  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Comments
      </h3>
      <div className="space-y-4">
        {mockComments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.avatar} />
              <AvatarFallback>
                {comment.user.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{comment.user}</span>
                <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px]"
        />
        <Button size="icon" className="shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
