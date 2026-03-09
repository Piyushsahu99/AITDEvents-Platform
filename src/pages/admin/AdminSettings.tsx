import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Search, UserPlus, Users, FileText, Calendar, Briefcase } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const AdminSettings = () => {
  const [stats, setStats] = useState({ users: 0, events: 0, jobs: 0, blogs: 0 });
  const [admins, setAdmins] = useState<(Profile & { roleId: string })[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  const fetchData = async () => {
    const [users, events, jobs, blogs] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("jobs").select("id", { count: "exact", head: true }),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    ]);

    setStats({ users: users.data?.length ?? 0, events: events.count ?? 0, jobs: jobs.count ?? 0, blogs: blogs.count ?? 0 });
    setAllUsers(users.data ?? []);

    const { data: roles } = await supabase.from("user_roles").select("id, user_id").eq("role", "admin");
    const adminUserIds = roles?.map((r) => r.user_id) ?? [];
    const adminProfiles = (users.data ?? [])
      .filter((u) => adminUserIds.includes(u.id))
      .map((u) => ({ ...u, roleId: roles!.find((r) => r.user_id === u.id)!.id }));
    setAdmins(adminProfiles);
  };

  useEffect(() => { fetchData(); }, []);

  const addAdmin = async (userId: string) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) { toast.error("Failed to add admin"); return; }
    toast.success("Admin role granted");
    setShowAddAdmin(false);
    setSearch("");
    fetchData();
  };

  const removeAdmin = async (roleId: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
    if (error) { toast.error("Failed to remove admin"); return; }
    toast.success("Admin role removed");
    fetchData();
  };

  const filteredUsers = search.length >= 2
    ? allUsers.filter(
        (u) =>
          !admins.some((a) => a.id === u.id) &&
          (u.full_name?.toLowerCase().includes(search.toLowerCase()) || false)
      ).slice(0, 5)
    : [];

  return (
    <AdminLayout title="Settings" description="Platform configuration and admin management">
      {/* Platform Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: "Total Users", value: stats.users, icon: Users },
          { label: "Total Events", value: stats.events, icon: Calendar },
          { label: "Total Jobs", value: stats.jobs, icon: Briefcase },
          { label: "Total Posts", value: stats.blogs, icon: FileText },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" /> Admin Roles
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setShowAddAdmin(!showAddAdmin)}>
            <UserPlus className="h-4 w-4 mr-1" /> Add Admin
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddAdmin && (
            <div className="space-y-2 p-3 rounded-lg border border-border bg-muted/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users by name..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              {filteredUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={u.avatar_url ?? ""} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">{(u.full_name || "?")[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{u.full_name || "Anonymous"}</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => addAdmin(u.id)}>
                    <Shield className="h-3.5 w-3.5 mr-1" /> Make Admin
                  </Button>
                </div>
              ))}
              {search.length >= 2 && filteredUsers.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">No matching users found</p>
              )}
            </div>
          )}

          {admins.length === 0 ? (
            <p className="text-sm text-muted-foreground">No admins configured</p>
          ) : (
            <div className="space-y-2">
              {admins.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={a.avatar_url ?? ""} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">{(a.full_name || "?")[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium text-sm">{a.full_name || "Anonymous"}</span>
                      <p className="text-xs text-muted-foreground">{a.college || "—"}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => removeAdmin(a.roleId)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminSettings;
