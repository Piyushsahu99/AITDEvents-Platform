import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Users, Send, Smile, Loader2, LogOut, Settings, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Message {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: { full_name: string | null };
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  profile?: { full_name: string | null };
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  category: string;
  created_by: string;
}

const CommunityGroup = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    if (!id) { navigate("/community"); return; }
    fetchGroup();
  }, [user, authLoading, id]);

  const fetchGroup = async () => {
    setLoading(true);

    // Get group
    const { data: groupData } = await supabase.from("community_groups").select("*").eq("id", id).single();
    if (!groupData) { navigate("/community"); return; }
    setGroup(groupData);

    // Check membership
    const { data: membership } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", id)
      .eq("user_id", user!.id)
      .single();
    setIsMember(!!membership);

    // Get members
    const { data: membersData } = await supabase
      .from("group_members")
      .select("id, user_id, role")
      .eq("group_id", id);

    // Get profiles for members
    const userIds = membersData?.map((m) => m.user_id) || [];
    const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", userIds);
    const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
    setMembers(
      (membersData || []).map((m) => ({ ...m, profile: profileMap.get(m.user_id) }))
    );

    // Get messages
    if (membership) {
      const { data: messagesData } = await supabase
        .from("group_messages")
        .select("*")
        .eq("group_id", id)
        .order("created_at", { ascending: true })
        .limit(100);

      // Attach profiles
      const msgUserIds = [...new Set(messagesData?.map((m) => m.user_id) || [])];
      const { data: msgProfiles } = await supabase.from("profiles").select("id, full_name").in("id", msgUserIds);
      const msgProfileMap = new Map(msgProfiles?.map((p) => [p.id, p]) || []);
      setMessages((messagesData || []).map((m) => ({ ...m, profile: msgProfileMap.get(m.user_id) })));
    }

    setLoading(false);
  };

  // Subscribe to new messages
  useEffect(() => {
    if (!id || !isMember) return;

    const channel = supabase
      .channel(`group_messages_${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "group_messages", filter: `group_id=eq.${id}` },
        async (payload) => {
          const msg = payload.new as Message;
          // Fetch profile
          const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", msg.user_id).single();
          setMessages((prev) => [...prev, { ...msg, profile }]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, isMember]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !isMember) return;
    setSending(true);
    const { error } = await supabase.from("group_messages").insert({ group_id: id, user_id: user!.id, content: newMessage.trim() });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setNewMessage("");
    setSending(false);
  };

  const handleLeave = async () => {
    await supabase.from("group_members").delete().eq("group_id", id).eq("user_id", user!.id);
    toast({ title: "Left group" });
    navigate("/community");
  };

  const handleJoin = async () => {
    const { error } = await supabase.from("group_members").insert({ group_id: id, user_id: user!.id });
    if (!error) {
      toast({ title: "Joined!" });
      fetchGroup();
    }
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

  if (!group) return null;

  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-4">
        <div className="container max-w-4xl h-[calc(100vh-6rem)] flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 py-4 border-b border-border">
            <Button variant="ghost" size="icon" onClick={() => navigate("/community")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10 rounded-xl bg-gradient-hero text-primary-foreground">
              <AvatarFallback className="rounded-xl bg-gradient-hero text-primary-foreground font-bold">
                {group.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold truncate">{group.name}</h1>
              <p className="text-xs text-muted-foreground">{members.length} members • #{group.category}</p>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm"><Users className="h-4 w-4 mr-1" /> Members</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Members ({members.length})</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-3">
                  {members.map((m) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs bg-muted">
                          {m.profile?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{m.profile?.full_name || "Anonymous"}</p>
                        <Badge variant="outline" className="text-xs">{m.role}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                {isMember && (
                  <Button variant="destructive" className="w-full mt-6" onClick={handleLeave}>
                    <LogOut className="h-4 w-4 mr-2" /> Leave Group
                  </Button>
                )}
              </SheetContent>
            </Sheet>
          </div>

          {/* Messages */}
          {isMember ? (
            <>
              <ScrollArea className="flex-1 py-4">
                <div className="space-y-4 px-1">
                  {messages.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Hash className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>No messages yet. Say hello!</p>
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isOwn = msg.user_id === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                          {!isOwn && (
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="text-xs bg-muted">
                                {msg.profile?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            {!isOwn && <p className="text-xs text-muted-foreground mb-1">{msg.profile?.full_name || "Anonymous"}</p>}
                            <div className={`rounded-2xl px-4 py-2 ${isOwn ? "bg-gradient-hero text-primary-foreground" : "bg-muted"}`}>
                              <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex items-center gap-2 py-3 border-t border-border">
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
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <Hash className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h2 className="text-lg font-semibold mb-2">Join to Chat</h2>
              <p className="text-muted-foreground mb-6 max-w-sm">{group.description || "This group is waiting for you!"}</p>
              <Button onClick={handleJoin} className="bg-gradient-hero text-primary-foreground">Join Group</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CommunityGroup;
