import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Link as LinkIcon, Receipt, FileText } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Message, Tenant } from "@shared/schema";

interface ConversationSummary {
  tenant: Tenant;
  lastMessage: Message | null;
  unreadCount: number;
}

export default function Messages() {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const { data: tenants = [] } = useQuery<Tenant[]>({
    queryKey: ["/api/tenants"],
  });

  const { data: allMessages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const { data: selectedMessages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages/tenant", selectedTenantId],
    enabled: !!selectedTenantId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { tenantId: string; content: string; sender: string }) => {
      return apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/tenant", selectedTenantId] });
      setMessage("");
    },
  });

  const conversations: ConversationSummary[] = tenants.map(tenant => {
    const tenantMessages = allMessages.filter(m => m.tenantId === tenant.id);
    const lastMessage = tenantMessages.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0] || null;
    
    return {
      tenant,
      lastMessage,
      unreadCount: 0,
    };
  });

  const selectedTenant = tenants.find(t => t.id === selectedTenantId);

  const handleSendMessage = () => {
    if (!selectedTenantId || !message.trim()) return;
    
    sendMessageMutation.mutate({
      tenantId: selectedTenantId,
      content: message,
      sender: "admin",
    });
  };

  return (
    <div className="flex flex-col h-full pb-20">
      {!selectedTenantId ? (
        <>
          <header className="sticky top-0 bg-background border-b border-border z-10 px-4 py-3">
            <h1 className="text-xl font-semibold">Messages</h1>
          </header>
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => (
                <Card
                  key={conv.tenant.id}
                  className="p-4 cursor-pointer hover-elevate active-elevate-2"
                  onClick={() => setSelectedTenantId(conv.tenant.id)}
                  data-testid={`conversation-${conv.tenant.id}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {conv.tenant.billingName.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{conv.tenant.billingName}</h3>
                        {conv.unreadCount > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage?.content || "No messages"}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <header className="sticky top-0 bg-background border-b border-border z-10 px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelectedTenantId(null)}
                data-testid="button-back"
              >
                ←
              </Button>
              <Avatar>
                <AvatarFallback>
                  {selectedTenant?.billingName.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-lg font-semibold">{selectedTenant?.billingName}</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {selectedMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No messages yet. Start a conversation!
              </div>
            ) : (
              selectedMessages.map((msg) => (
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
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
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
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                data-testid="input-message"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isPending || !message.trim()}
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
