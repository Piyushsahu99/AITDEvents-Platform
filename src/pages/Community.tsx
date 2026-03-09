import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/animated/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Search, MessageCircle, Sparkles, Loader2, LogIn, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Group {
  id: string;
  name: string;
  description: string | null;
  category: string;
  is_public: boolean;
  created_by: string;
  created_at: string;
  member_count?: number;
}

const Community = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", category: "general" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchGroups();
  }, [user, authLoading]);

  const fetchGroups = async () => {
    setLoading(true);
    // Fetch all public groups
    const { data: allGroups } = await supabase
      .from("community_groups")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    // Fetch my memberships
    const { data: memberships } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", user!.id);

    const myGroupIds = new Set(memberships?.map((m) => m.group_id) || []);

    // Fetch member counts
    const { data: counts } = await supabase
      .from("group_members")
      .select("group_id");

    const countMap: Record<string, number> = {};
    counts?.forEach((c) => {
      countMap[c.group_id] = (countMap[c.group_id] || 0) + 1;
    });

    const groupsWithCount = (allGroups || []).map((g) => ({
      ...g,
      member_count: countMap[g.id] || 0,
    }));

    setGroups(groupsWithCount);
    setMyGroups(groupsWithCount.filter((g) => myGroupIds.has(g.id)));
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newGroup.name.trim()) return;
    setCreating(true);
    const { data, error } = await supabase
      .from("community_groups")
      .insert({ name: newGroup.name, description: newGroup.description || null, category: newGroup.category, created_by: user!.id })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (data) {
      // Auto-join as admin
      await supabase.from("group_members").insert({ group_id: data.id, user_id: user!.id, role: "admin" });
      toast({ title: "Group created!", description: `${data.name} is now live.` });
      setCreateOpen(false);
      setNewGroup({ name: "", description: "", category: "general" });
      fetchGroups();
    }
    setCreating(false);
  };

  const handleJoin = async (groupId: string) => {
    const { error } = await supabase.from("group_members").insert({ group_id: groupId, user_id: user!.id });
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already a member", description: "You're already in this group." });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Joined!", description: "You've joined the group." });
      fetchGroups();
    }
  };

  const filtered = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.description || "").toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) {
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
      <div className="min-h-screen pt-24 pb-16">
        <div className="container">
          <AnimatedSection>
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Users className="h-3 w-3 mr-1" /> Community
              </Badge>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Join the <span className="text-gradient">Conversation</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Connect with like-minded students in topic-based groups, chat in real-time, and share updates.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search groups..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => navigate("/community/messages")} variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" /> Messages
                </Button>
                <Button onClick={() => navigate("/community/feed")} variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" /> Feed
                </Button>
                <Button onClick={() => setCreateOpen(true)} className="bg-gradient-hero text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" /> Create Group
                </Button>
              </div>
            </div>
          </AnimatedSection>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2">
              <TabsTrigger value="all">All Groups</TabsTrigger>
              <TabsTrigger value="mine">My Groups ({myGroups.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Hash className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No groups found. Create one!</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((group, i) => (
                    <AnimatedSection key={group.id} delay={i * 0.03}>
                      <GroupCard group={group} isMember={myGroups.some((g) => g.id === group.id)} onJoin={() => handleJoin(group.id)} onOpen={() => navigate(`/community/${group.id}`)} />
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="mine">
              {myGroups.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>You haven't joined any groups yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {myGroups.map((group, i) => (
                    <AnimatedSection key={group.id} delay={i * 0.03}>
                      <GroupCard group={group} isMember onJoin={() => {}} onOpen={() => navigate(`/community/${group.id}`)} />
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Group Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Group Name *</label>
              <Input value={newGroup.name} onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })} placeholder="e.g., React Developers" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea value={newGroup.description} onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })} placeholder="What's this group about?" rows={3} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input value={newGroup.category} onChange={(e) => setNewGroup({ ...newGroup, category: e.target.value })} placeholder="e.g., programming, design" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating || !newGroup.name.trim()} className="bg-gradient-hero text-primary-foreground">
              {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

const GroupCard = ({ group, isMember, onJoin, onOpen }: { group: Group; isMember: boolean; onJoin: () => void; onOpen: () => void }) => (
  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
    <CardHeader className="pb-2">
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 rounded-xl bg-gradient-hero text-primary-foreground">
          <AvatarFallback className="rounded-xl bg-gradient-hero text-primary-foreground font-bold">
            {group.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base truncate">{group.name}</CardTitle>
          <Badge variant="outline" className="text-xs mt-1">{group.category}</Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent className="flex-1 pb-2">
      <CardDescription className="line-clamp-2 text-sm">{group.description || "No description"}</CardDescription>
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <Users className="h-3 w-3" /> {group.member_count ?? 0} members
      </div>
    </CardContent>
    <div className="px-6 pb-4 flex gap-2">
      {isMember ? (
        <Button onClick={onOpen} className="flex-1 bg-gradient-hero text-primary-foreground">Open</Button>
      ) : (
        <>
          <Button onClick={onJoin} variant="outline" className="flex-1"><LogIn className="h-4 w-4 mr-1" /> Join</Button>
          <Button onClick={onOpen} variant="ghost" size="icon"><MessageCircle className="h-4 w-4" /></Button>
        </>
      )}
    </div>
  </Card>
);

export default Community;
