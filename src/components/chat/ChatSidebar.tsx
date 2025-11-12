import { Plus, MessageSquare, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Kanban Board Discussion",
    lastMessage: "Can you explain what a Kanban board is?",
    timestamp: "2m ago",
  },
  {
    id: "2",
    title: "Project Management Tips",
    lastMessage: "How do I organize my tasks better?",
    timestamp: "1h ago",
  },
  {
    id: "3",
    title: "Team Collaboration",
    lastMessage: "What are the best practices for remote teams?",
    timestamp: "3h ago",
  },
];

export function ChatSidebar() {
  const [activeConversation, setActiveConversation] = useState("1");

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Button className="w-full justify-start gap-2" variant="default">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {mockConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              className={`w-full text-left p-3 rounded-lg transition-all group hover:bg-accent ${
                activeConversation === conversation.id
                  ? "bg-accent"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conversation.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {conversation.timestamp}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Chat Assistant v1.0
        </p>
      </div>
    </div>
  );
}
