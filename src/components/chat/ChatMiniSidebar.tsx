import { ArrowLeft, Plus, MessageSquare, Settings, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebarManager } from "@/contexts/SidebarContext";
import { NavLink } from "react-router-dom";

const chatMenuItems = [
  { title: "New Chat", icon: Plus, url: "/chat", action: "new" },
  { title: "Saved Chats", icon: History, url: "/chat", action: "saved" },
  { title: "Settings", icon: Settings, url: "/chat", action: "settings" },
];

export function ChatMiniSidebar() {
  const { showMainSidebar } = useSidebarManager();

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col animate-slide-in-right">
      {/* Header with Back Button */}
      <div className="p-4 border-b border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 hover:bg-accent mb-3"
          onClick={showMainSidebar}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Main</span>
        </Button>
        
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Chat Assistant</h2>
            <p className="text-xs text-muted-foreground">AI-powered help</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {chatMenuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-accent group"
            >
              <div className="h-9 w-9 rounded-lg bg-muted/40 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {item.title}
              </span>
            </NavLink>
          ))}
        </div>

        {/* Recent Chats Section */}
        <div className="p-3 mt-4">
          <div className="px-2 mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recent
            </p>
          </div>
          <div className="space-y-1">
            {["Kanban Discussion", "Project Setup", "Team Questions"].map(
              (chat, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-accent transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm text-foreground truncate">
                      {chat}
                    </span>
                  </div>
                </button>
              )
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="px-2 py-1.5 rounded-lg bg-muted/40">
          <p className="text-xs text-muted-foreground text-center">
            Chat Assistant v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
