import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis } from "recharts";
import { format, subWeeks, startOfWeek } from "date-fns";
import { Badge } from "@/components/ui/badge";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--destructive))",
];

const AdminAnalytics = () => {
  const [userGrowth, setUserGrowth] = useState<{ week: string; count: number }[]>([]);
  const [rsvpTrend, setRsvpTrend] = useState<{ week: string; count: number }[]>([]);
  const [contentDist, setContentDist] = useState<{ name: string; value: number }[]>([]);
  const [topEvents, setTopEvents] = useState<{ title: string; rsvps: number }[]>([]);
  const [topPosts, setTopPosts] = useState<{ title: string; views: number }[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const twelveWeeksAgo = subWeeks(new Date(), 12).toISOString();

      // User growth by week
      const { data: profiles } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", twelveWeeksAgo)
        .order("created_at");

      const weekMap: Record<string, number> = {};
      for (let i = 11; i >= 0; i--) {
        const w = format(startOfWeek(subWeeks(new Date(), i)), "MMM dd");
        weekMap[w] = 0;
      }
      profiles?.forEach((p) => {
        const w = format(startOfWeek(new Date(p.created_at)), "MMM dd");
        if (w in weekMap) weekMap[w]++;
      });
      setUserGrowth(Object.entries(weekMap).map(([week, count]) => ({ week, count })));

      // RSVP trend by week
      const { data: rsvps } = await supabase
        .from("event_rsvps")
        .select("created_at")
        .gte("created_at", twelveWeeksAgo)
        .order("created_at");

      const rsvpWeekMap: Record<string, number> = {};
      for (let i = 11; i >= 0; i--) {
        const w = format(startOfWeek(subWeeks(new Date(), i)), "MMM dd");
        rsvpWeekMap[w] = 0;
      }
      rsvps?.forEach((r) => {
        const w = format(startOfWeek(new Date(r.created_at)), "MMM dd");
        if (w in rsvpWeekMap) rsvpWeekMap[w]++;
      });
      setRsvpTrend(Object.entries(rsvpWeekMap).map(([week, count]) => ({ week, count })));

      // Content distribution
      const [events, jobs, blogs, games] = await Promise.all([
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("game_sessions").select("id", { count: "exact", head: true }),
      ]);
      setContentDist([
        { name: "Events", value: events.count ?? 0 },
        { name: "Jobs", value: jobs.count ?? 0 },
        { name: "Blogs", value: blogs.count ?? 0 },
        { name: "Games", value: games.count ?? 0 },
      ]);

      // Top events by RSVPs
      const { data: allRsvps } = await supabase.from("event_rsvps").select("event_id");
      const eventCount: Record<string, number> = {};
      allRsvps?.forEach((r) => {
        eventCount[r.event_id] = (eventCount[r.event_id] || 0) + 1;
      });
      const topEventIds = Object.entries(eventCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      if (topEventIds.length > 0) {
        const { data: eventData } = await supabase
          .from("events")
          .select("id, title")
          .in("id", topEventIds.map(([id]) => id));
        const eventMap = Object.fromEntries(eventData?.map((e) => [e.id, e.title]) ?? []);
        setTopEvents(topEventIds.map(([id, count]) => ({ title: eventMap[id] || "Unknown", rsvps: count })));
      }

      // Top blog posts by views
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("title, views")
        .order("views", { ascending: false })
        .limit(5);
      setTopPosts(posts?.map((p) => ({ title: p.title, views: p.views })) ?? []);
    };

    fetchAnalytics();
  }, []);

  const lineConfig = { count: { label: "Users", color: "hsl(var(--primary))" } };
  const barConfig = { count: { label: "RSVPs", color: "hsl(var(--accent))" } };
  const pieConfig = {
    Events: { label: "Events", color: COLORS[0] },
    Jobs: { label: "Jobs", color: COLORS[1] },
    Blogs: { label: "Blogs", color: COLORS[2] },
    Games: { label: "Games", color: COLORS[3] },
  };

  return (
    <AdminLayout title="Analytics" description="Platform performance insights">
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* User Growth */}
        <Card>
          <CardHeader><CardTitle className="text-base">User Growth (12 Weeks)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={lineConfig} className="h-[250px] w-full">
              <LineChart data={userGrowth}>
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* RSVP Trend */}
        <Card>
          <CardHeader><CardTitle className="text-base">RSVP Trend (12 Weeks)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={barConfig} className="h-[250px] w-full">
              <BarChart data={rsvpTrend}>
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Content Distribution */}
        <Card>
          <CardHeader><CardTitle className="text-base">Content Distribution</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={pieConfig} className="h-[250px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={contentDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {contentDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Content */}
        <Card>
          <CardHeader><CardTitle className="text-base">Top Content</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Top Events by RSVPs</h4>
              {topEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground">No RSVPs yet</p>
              ) : (
                <div className="space-y-2">
                  {topEvents.map((e, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="truncate max-w-[200px]">{e.title}</span>
                      <Badge variant="secondary">{e.rsvps} RSVPs</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Top Blog Posts by Views</h4>
              {topPosts.length === 0 ? (
                <p className="text-xs text-muted-foreground">No posts yet</p>
              ) : (
                <div className="space-y-2">
                  {topPosts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="truncate max-w-[200px]">{p.title}</span>
                      <Badge variant="outline">{p.views} views</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
