import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import { Calendar, Briefcase, FileText, Users, Gamepad2, UserCheck } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ events: 0, jobs: 0, blogs: 0, users: 0, games: 0, rsvps: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [events, jobs, blogs, users, games, rsvps] = await Promise.all([
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("game_sessions").select("id", { count: "exact", head: true }),
        supabase.from("event_rsvps").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        events: events.count ?? 0,
        jobs: jobs.count ?? 0,
        blogs: blogs.count ?? 0,
        users: users.count ?? 0,
        games: games.count ?? 0,
        rsvps: rsvps.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard" description="Overview of your platform">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Events" value={stats.events} icon={Calendar} gradient="bg-gradient-events" />
        <StatsCard title="Jobs" value={stats.jobs} icon={Briefcase} gradient="bg-gradient-cool" />
        <StatsCard title="Blog Posts" value={stats.blogs} icon={FileText} gradient="bg-gradient-primary" />
        <StatsCard title="Users" value={stats.users} icon={Users} gradient="bg-gradient-mentorship" />
        <StatsCard title="Game Sessions" value={stats.games} icon={Gamepad2} gradient="bg-gradient-accent" />
        <StatsCard title="RSVPs" value={stats.rsvps} icon={UserCheck} gradient="bg-gradient-success" />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
