import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import { Calendar, Briefcase, FileText, Users, Gamepad2, UserCheck, Plus, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--destructive))",
  "hsl(var(--muted-foreground))",
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ events: 0, jobs: 0, blogs: 0, users: 0, games: 0, rsvps: 0 });
  const [contentDist, setContentDist] = useState<{ name: string; value: number }[]>([]);
  const [recentSignups, setRecentSignups] = useState<{ day: string; count: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ type: string; title: string; time: string }[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [events, jobs, blogs, users, games, rsvps] = await Promise.all([
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("game_sessions").select("id", { count: "exact", head: true }),
        supabase.from("event_rsvps").select("id", { count: "exact", head: true }),
      ]);

      const s = {
        events: events.count ?? 0,
        jobs: jobs.count ?? 0,
        blogs: blogs.count ?? 0,
        users: users.count ?? 0,
        games: games.count ?? 0,
        rsvps: rsvps.count ?? 0,
      };
      setStats(s);
      setContentDist([
        { name: "Events", value: s.events },
        { name: "Jobs", value: s.jobs },
        { name: "Blogs", value: s.blogs },
        { name: "Games", value: s.games },
      ]);

      // Recent signups (last 7 days)
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      const { data: profiles } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", sevenDaysAgo)
        .order("created_at");

      const dayMap: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = format(subDays(new Date(), i), "MMM dd");
        dayMap[d] = 0;
      }
      profiles?.forEach((p) => {
        const d = format(new Date(p.created_at), "MMM dd");
        if (d in dayMap) dayMap[d]++;
      });
      setRecentSignups(Object.entries(dayMap).map(([day, count]) => ({ day, count })));

      // Recent activity
      const [{ data: recentEvents }, { data: recentPosts }, { data: recentRsvps }] = await Promise.all([
        supabase.from("events").select("title, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("blog_posts").select("title, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("event_rsvps").select("created_at, event_id").order("created_at", { ascending: false }).limit(3),
      ]);

      const activity: { type: string; title: string; time: string }[] = [];
      recentEvents?.forEach((e) => activity.push({ type: "Event", title: e.title, time: e.created_at }));
      recentPosts?.forEach((p) => activity.push({ type: "Blog", title: p.title, time: p.created_at }));
      recentRsvps?.forEach((r) => activity.push({ type: "RSVP", title: `Event RSVP`, time: r.created_at }));
      activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setRecentActivity(activity.slice(0, 5));
    };
    fetchAll();
  }, []);

  const chartConfig = {
    count: { label: "Signups", color: "hsl(var(--primary))" },
  };

  const pieConfig = {
    Events: { label: "Events", color: CHART_COLORS[0] },
    Jobs: { label: "Jobs", color: CHART_COLORS[1] },
    Blogs: { label: "Blogs", color: CHART_COLORS[2] },
    Games: { label: "Games", color: CHART_COLORS[3] },
  };

  return (
    <AdminLayout title="Dashboard" description="Overview of your platform">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatsCard title="Events" value={stats.events} icon={Calendar} gradient="bg-gradient-events" />
        <StatsCard title="Jobs" value={stats.jobs} icon={Briefcase} gradient="bg-gradient-cool" />
        <StatsCard title="Blog Posts" value={stats.blogs} icon={FileText} gradient="bg-gradient-primary" />
        <StatsCard title="Users" value={stats.users} icon={Users} gradient="bg-gradient-mentorship" />
        <StatsCard title="Game Sessions" value={stats.games} icon={Gamepad2} gradient="bg-gradient-accent" />
        <StatsCard title="RSVPs" value={stats.rsvps} icon={UserCheck} gradient="bg-gradient-success" />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { label: "New Event", href: "/admin/events", icon: Calendar },
          { label: "New Job", href: "/admin/jobs", icon: Briefcase },
          { label: "New Post", href: "/admin/blog", icon: FileText },
        ].map((a) => (
          <Link key={a.href} to={a.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{a.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" /> Signups (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <BarChart data={recentSignups}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={pieConfig} className="h-[220px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={contentDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {contentDist.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {a.type}
                    </span>
                    <span>{a.title}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">{format(new Date(a.time), "MMM dd, HH:mm")}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
