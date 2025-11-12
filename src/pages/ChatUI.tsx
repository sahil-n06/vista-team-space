import { useState } from "react";
import { Send, Paperclip, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  { role: "assistant", content: "Hello! How can I assist you today?" },
  { role: "user", content: "Can you explain what a Kanban board is?" },
  {
    role: "assistant",
    content:
      "Sure! A Kanban board helps visualize tasks and workflow. It consists of columns representing different stages (like 'To Do', 'In Progress', 'Done') and cards representing individual tasks. You can move cards between columns as work progresses, making it easy to track project status at a glance.",
  },
  { role: "user", content: "That's helpful, thanks!" },
  {
    role: "assistant",
    content:
      "You're welcome! Feel free to ask if you have any other questions about project management or anything else.",
  },
];

const ChatUI = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { role: "user", content: inputValue }]);
      setInputValue("");
      // Simulate assistant response (static for now)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I received your message. This is a placeholder response.",
          },
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">Chat Assistant</h1>
      </header>

      {/* Chat Messages Area */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 animate-fade-in ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                  className={
                    message.role === "assistant"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-secondary-foreground"
                  }
                >
                  {message.role === "assistant" ? "AI" : "U"}
                </AvatarFallback>
              </Avatar>

              {/* Message Bubble */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === "assistant"
                    ? "bg-muted text-foreground"
                    : "bg-primary/10 text-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-background border-t border-border px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            {/* Attachment Button */}
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 hover:bg-accent"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            {/* Input Field */}
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="pr-12 rounded-xl border-input focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Stop Button */}
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 hover:bg-accent"
            >
              <StopCircle className="h-5 w-5" />
            </Button>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="shrink-0 rounded-xl"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
