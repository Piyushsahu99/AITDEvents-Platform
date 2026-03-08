import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentTable, { Column } from "@/components/admin/ContentTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type GameSession = Tables<"game_sessions">;

const columns: Column[] = [
  { key: "title", label: "Title" },
  { key: "game_type", label: "Type" },
  { key: "is_active", label: "Active", render: (v) => v ? <Badge className="bg-success/10 text-success border-success/20" variant="outline">Active</Badge> : <Badge variant="outline">Inactive</Badge> },
  { key: "max_players", label: "Max Players", render: (v) => v ?? "∞" },
];

const AdminGames = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [games, setGames] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", game_type: "quiz", description: "", max_players: "", time_limit_seconds: "", is_active: false });

  const fetchGames = async () => {
    const { data } = await supabase.from("game_sessions").select("*").order("created_at", { ascending: false });
    setGames(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchGames(); }, []);

  const handleCreate = async () => {
    if (!form.title) { toast({ title: "Title is required", variant: "destructive" }); return; }
    const { error } = await supabase.from("game_sessions").insert({
      title: form.title,
      game_type: form.game_type as any,
      description: form.description || null,
      max_players: form.max_players ? parseInt(form.max_players) : null,
      time_limit_seconds: form.time_limit_seconds ? parseInt(form.time_limit_seconds) : null,
      is_active: form.is_active,
      created_by: user?.id ?? null,
    });
    if (error) {
      toast({ title: "Error creating game", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Game session created!" });
      setOpen(false);
      setForm({ title: "", game_type: "quiz", description: "", max_players: "", time_limit_seconds: "", is_active: false });
      fetchGames();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("game_sessions").delete().eq("id", id);
    fetchGames();
  };

  return (
    <AdminLayout
      title="Games"
      description="Create and manage game sessions"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-hero text-primary-foreground"><Plus className="h-4 w-4 mr-2" />New Game</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Game Session</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select value={form.game_type} onValueChange={(v) => setForm({ ...form, game_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="challenge">Challenge</SelectItem>
                      <SelectItem value="treasure_hunt">Treasure Hunt</SelectItem>
                      <SelectItem value="coding">Coding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Max Players</Label><Input type="number" value={form.max_players} onChange={(e) => setForm({ ...form, max_players: e.target.value })} /></div>
              </div>
              <div><Label>Time Limit (seconds)</Label><Input type="number" value={form.time_limit_seconds} onChange={(e) => setForm({ ...form, time_limit_seconds: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
              <div className="flex items-center gap-3">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <Label>Active</Label>
              </div>
              <Button className="w-full bg-gradient-hero text-primary-foreground" onClick={handleCreate}>Create Game</Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <ContentTable columns={columns} data={games} loading={loading} onDelete={handleDelete} />
    </AdminLayout>
  );
};

export default AdminGames;
