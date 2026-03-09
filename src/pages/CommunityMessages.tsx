import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Send, Smile, Loader2, MessageCircle, Search, Plus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface Conversation {
  other_user_id: string;
  other_user_name: string | null;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface UserProfile {
  id: string;
  full_name: string | null;
}

const CommunityMessages = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConvo, setActiveConvo] = useState<string | null>(searchParams.get("with"));
  const [activeUserName, setActiveUserName] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [newChatOpen, setNewChatOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    fetchConversations();
  }, [user, authLoading]);

  useEffect(() => {
    if (activeConvo) fetchMessages(activeConvo);
  }, [activeConvo]);

  const fetchConversations = async () => {
    setLoading(true);
    // Get all DMs involving user
    const { data: allDMs } = await supabase
      .from("direct_messages")
      .select("*")
      .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
      .order("created_at", { ascending: false });

    // Group by other user
    const convoMap = new Map<string, { messages: Message[]; unread: number }>();
    (allDMs || []).forEach((dm) => {
      const otherId = dm.sender_id === user!.id ? dm.receiver_id : dm.sender_id;
      if (!convoMap.has(otherId)) convoMap.set(otherId, { messages: [], unread: 0 });
      convoMap.get(otherId)!.messages.push(dm);
      if (!dm.read && dm.receiver_id === user!.id) convoMap.get(otherId)!.unread++;
    });

    // Fetch profiles
    const userIds = Array.from(convoMap.keys());
    const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", userIds);
    const profileMap = new Map(profiles?.map((p) => [p.id, p.full_name]) || []);

    const convos: Conversation[] = Array.from(convoMap.entries()).map(([otherId, data]) => {
      const lastMsg = data.messages[0];
      return {
        other_user_id: otherId,
        other_user_name: profileMap.get(otherId) || null,
        last_message: lastMsg.content,
        last_message_at: lastMsg.created_at,
        unread_count: data.unread,
      };
    });

    setConversations(convos.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()));

    // If activeConvo is set, get name
    if (activeConvo) {
      setActiveUserName(profileMap.get(activeConvo) || null);
    }

    setLoading(false);
  };

  const fetchMessages = async (withUserId: string) => {
    const { data } = await supabase
      .from("direct_messages")
      .select("*")
      .or(`and(sender_id.eq.${user!.id},receiver_id.eq.${withUserId}),and(sender_id.eq.${withUserId},receiver_id.eq.${user!.id})`)
      .order("created_at", { ascending: true });

    setMessages(data || []);

    // Mark as read
    await supabase
      .from("direct_messages")
      .update({ read: true })
      .eq("sender_id", withUserId)
      .eq("receiver_id", user!.id)
      .eq("read", false);

    // Get name
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", withUserId).single();
    setActiveUserName(profile?.full_name || null);
  };

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("direct_messages_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "direct_messages" },
        (payload) => {
          const dm = payload.new as Message;
          if (dm.sender_id === user.id || dm.receiver_id === user.id) {
            if (activeConvo && (dm.sender_id === activeConvo || dm.receiver_id === activeConvo)) {
              setMessages((prev) => [...prev, dm]);
            }
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, activeConvo]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConvo) return;
    setSending(true);
    const { error } = await supabase.from("direct_messages").insert({
      sender_id: user!.id,
      receiver_id: activeConvo,
      content: newMessage.trim(),
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setNewMessage("");
    setSending(false);
  };

  const handleSearchUsers = async () => {
    if (!userSearch.trim()) return;
    setSearching(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name")
      .ilike("full_name", `%${userSearch}%`)
      .neq("id", user!.id)
      .limit(10);
    setSearchResults(data || []);
    setSearching(false);
  };

  const startChat = (profile: UserProfile) => {
    setNewChatOpen(false);
    setUserSearch("");
    setSearchResults([]);
    setActiveConvo(profile.id);
    setSearchParams({ with: profile.id });
    setActiveUserName(profile.full_name);
  };

  const onEmojiSelect = (emoji: { native: string }) => {
    setNewMessage((prev) => prev + emoji.native);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-4">
        <div className="container max-w-4xl h-[calc(100vh-6rem)] flex">
          {/* Sidebar */}
          <div className={`w-full sm:w-80 border-r border-border flex flex-col ${activeConvo ? "hidden sm:flex" : "flex"}`}>
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <Button variant="ghost" size="icon" onClick={() => navigate("/community")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-semibold flex-1">Messages</h1>
              <Button size="icon" variant="ghost" onClick={() => setNewChatOpen(true)}>
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              {conversations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground px-4">
                  <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No messages yet</p>
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => setNewChatOpen(true)}>
                    Start a conversation
                  </Button>
                </div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.other_user_id}
                    onClick={() => { setActiveConvo(c.other_user_id); setSearchParams({ with: c.other_user_id }); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left ${activeConvo === c.other_user_id ? "bg-muted" : ""}`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {c.other_user_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{c.other_user_name || "Anonymous"}</p>
                        <span className="text-[10px] text-muted-foreground">{new Date(c.last_message_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{c.last_message}</p>
                    </div>
                    {c.unread_count > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
                        {c.unread_count}
                      </Badge>
                    )}
                  </button>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col ${activeConvo ? "flex" : "hidden sm:flex"}`}>
            {activeConvo ? (
              <>
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setActiveConvo(null)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {activeUserName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activeUserName || "Anonymous"}</p>
                  </div>
                </div>

                <ScrollArea className="flex-1 py-4 px-4">
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const isOwn = msg.sender_id === user?.id;
                      return (
                        <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isOwn ? "bg-gradient-hero text-primary-foreground" : "bg-muted"}`}>
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="flex items-center gap-2 p-4 border-t border-border">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="start" className="p-0 w-auto border-0">
                      <Picker data={data} onEmojiSelect={onEmojiSelect} theme="auto" />
                    </PopoverContent>
                  </Popover>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  />
                  <Button onClick={handleSend} disabled={sending || !newMessage.trim()} className="bg-gradient-hero text-primary-foreground">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Select a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name..."
                onKeyDown={(e) => e.key === "Enter" && handleSearchUsers()}
              />
              <Button onClick={handleSearchUsers} disabled={searching}>
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => startChat(profile)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {profile.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-sm">{profile.full_name || "Anonymous"}</p>
                </button>
              ))}
              {searchResults.length === 0 && userSearch && !searching && (
                <p className="text-center text-sm text-muted-foreground py-4">No users found</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CommunityMessages;
