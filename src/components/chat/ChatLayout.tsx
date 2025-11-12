import { ChatSidebar } from "./ChatSidebar";
import { ChatMessages } from "./ChatMessages";

export function ChatLayout() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full bg-background">
      {/* Mini Sidebar */}
      <ChatSidebar />
      
      {/* Main Chat Area */}
      <div className="flex-1">
        <ChatMessages />
      </div>
    </div>
  );
}
