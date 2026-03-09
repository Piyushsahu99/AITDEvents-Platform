import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Shield, ShieldOff, User, Trophy, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const AdminUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filtered, setFiltered] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"points" | "level" | "created_at">("points");
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Profile | null>(null);

  const fetchData = async () => {
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").order("points", { ascending: false }),
      supabase.from("user_roles").select("user_id, role").eq("role", "admin"),
    ]);
    setUsers(profiles ?? []);
    setFiltered(profiles ?? []);
    setAdminIds(new Set(roles?.map((r) => r.user_id) ?? []));
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    let list = [...users];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(q) ||
          u.college?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortBy === "created_at") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return (b[sortBy] ?? 0) - (a[sortBy] ?? 0);
    });
    setFiltered(list);
  }, [search, sortBy, users]);

  const toggleAdmin = async (userId: string) => {
    if (adminIds.has(userId)) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (error) { toast.error("Failed to remove admin role"); return; }
      toast.success("Admin role removed");
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (error) { toast.error("Failed to add admin role"); return; }
      toast.success("Admin role granted");
    }
    fetchData();
  };

  return (
    <AdminLayout title="Users" description="Manage platform users">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or college..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="points">Sort by Points</SelectItem>
            <SelectItem value="level">Sort by Level</SelectItem>
            <SelectItem value="created_at">Sort by Joined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading users...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No users found</div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((u) => (
            <Card key={u.id} className="hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setSelected(u)}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={u.avatar_url ?? ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">{(u.full_name || "?")[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{u.full_name || "Anonymous"}</span>
                      {adminIds.has(u.id) && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Admin</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{u.college || "No college"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="hidden sm:flex items-center gap-1 text-muted-foreground"><Trophy className="h-3.5 w-3.5" /> {u.points}</span>
                  <Badge variant="outline">Lv. {u.level}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* User Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selected.avatar_url ?? ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">{(selected.full_name || "?")[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selected.full_name || "Anonymous"}</h3>
                  <p className="text-sm text-muted-foreground">{selected.college || "No college"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Points</p>
                  <p className="text-xl font-bold">{selected.points}</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="text-xl font-bold">{selected.level}</p>
                </div>
              </div>

              {selected.bio && <p className="text-sm text-muted-foreground">{selected.bio}</p>}

              <div className="space-y-1 text-sm">
                {selected.branch && <p><GraduationCap className="inline h-3.5 w-3.5 mr-1" /> {selected.branch}</p>}
                {selected.year_of_study && <p><User className="inline h-3.5 w-3.5 mr-1" /> Year {selected.year_of_study}</p>}
                {selected.phone && <p>📞 {selected.phone}</p>}
              </div>

              <p className="text-xs text-muted-foreground">Joined {new Date(selected.created_at).toLocaleDateString()}</p>

              <Button
                variant={adminIds.has(selected.id) ? "destructive" : "default"}
                className="w-full"
                onClick={() => toggleAdmin(selected.id)}
              >
                {adminIds.has(selected.id) ? (
                  <><ShieldOff className="h-4 w-4 mr-2" /> Remove Admin Role</>
                ) : (
                  <><Shield className="h-4 w-4 mr-2" /> Grant Admin Role</>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
