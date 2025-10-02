import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Link as LinkIcon, Receipt, FileText } from "lucide-react";

const mockConversations = [
  { id: "1", name: "John Smith", lastMessage: "Thank you for the receipt!", unread: 0 },
  { id: "2", name: "Sarah Johnson", lastMessage: "When is the payment due?", unread: 2 },
  { id: "3", name: "Michael Brown", lastMessage: "Payment link received", unread: 0 },
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const messages = selectedConversation
    ? [
        { id: "1", text: "Hello, I have a question about my bill", sender: "tenant", time: "10:30 AM" },
        { id: "2", text: "Hi! I'll be happy to help. What would you like to know?", sender: "admin", time: "10:32 AM" },
        { id: "3", text: "When is the payment due?", sender: "tenant", time: "10:33 AM" },
        { id: "4", text: "Your payment is due on October 1st.", sender: "admin", time: "10:35 AM" },
      ]
    : [];

  const selectedTenant = mockConversations.find((c) => c.id === selectedConversation);

  return (
    <div className="flex flex-col h-full pb-20">
      {!selectedConversation ? (
        <>
          <header className="sticky top-0 bg-background border-b border-border z-10 px-4 py-3">
            <h1 className="text-xl font-semibold">Messages</h1>
          </header>
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {mockConversations.map((conv) => (
              <Card
                key={conv.id}
                className="p-4 cursor-pointer hover-elevate active-elevate-2"
                onClick={() => setSelectedConversation(conv.id)}
                data-testid={`conversation-${conv.id}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{conv.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{conv.name}</h3>
                      {conv.unread > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <header className="sticky top-0 bg-background border-b border-border z-10 px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelectedConversation(null)}
                data-testid="button-back"
              >
                ←
              </Button>
              <Avatar>
                <AvatarFallback>
                  {selectedTenant?.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-lg font-semibold">{selectedTenant?.name}</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    msg.sender === "admin"
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-background p-4 space-y-3">
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" data-testid="button-share-payment-link">
                <LinkIcon className="w-4 h-4 mr-1" />
                Payment Link
              </Button>
              <Button size="sm" variant="secondary" data-testid="button-share-bill">
                <FileText className="w-4 h-4 mr-1" />
                Bill
              </Button>
              <Button size="sm" variant="secondary" data-testid="button-share-receipt">
                <Receipt className="w-4 h-4 mr-1" />
                Receipt
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    console.log("Send message:", message);
                    setMessage("");
                  }
                }}
                data-testid="input-message"
              />
              <Button
                size="icon"
                onClick={() => {
                  console.log("Send message:", message);
                  setMessage("");
                }}
                data-testid="button-send"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
