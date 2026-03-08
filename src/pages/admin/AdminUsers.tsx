import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentTable, { Column } from "@/components/admin/ContentTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const columns: Column[] = [
  {
    key: "full_name",
    label: "User",
    render: (v, row) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.avatar_url ?? ""} />
          <AvatarFallback className="text-xs bg-primary/10 text-primary">{(v || "?")[0]}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{v || "Anonymous"}</span>
      </div>
    ),
  },
  { key: "college", label: "College", render: (v) => v || "—" },
  { key: "points", label: "Points" },
  { key: "level", label: "Level", render: (v) => <Badge variant="outline">Lv. {v}</Badge> },
];

const AdminUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("profiles").select("*").order("points", { ascending: false });
      setUsers(data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <AdminLayout title="Users" description="View registered users">
      <ContentTable columns={columns} data={users} loading={loading} />
    </AdminLayout>
  );
};

export default AdminUsers;
