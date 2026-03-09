import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/animated/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Coins, Trophy, TrendingUp, Zap, Star, Target, Award,
  Calendar, Briefcase, BookOpen, Gamepad2, MessageCircle,
  ArrowRight, Flame, Crown, Medal, Loader2
} from "lucide-react";

interface ProfileData {
  full_name: string | null;
  points: number;
  level: number;
  college: string | null;
  avatar_url: string | null;
}

interface LeaderboardEntry {
  id: string;
  full_name: string | null;
  points: number;
  level: number;
  college: string | null;
}

const LEVEL_XP = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200, 6500];

const getLevelProgress = (points: number, level: number) => {
  const currentThreshold = LEVEL_XP[level - 1] ?? 0;
  const nextThreshold = LEVEL_XP[level] ?? currentThreshold + 1000;
  const progress = ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return { progress: Math.min(Math.max(progress, 0), 100), needed: nextThreshold - points };
};

const rankIcons = [Crown, Medal, Award];
const rankColors = ["text-amber-500", "text-slate-400", "text-orange-600"];

const quickActions = [
  { icon: Calendar, label: "Events", href: "/events", color: "text-primary" },
  { icon: Briefcase, label: "Jobs", href: "/jobs", color: "text-emerald-500" },
  { icon: BookOpen, label: "Learn", href: "/learning", color: "text-blue-500" },
  { icon: Gamepad2, label: "Games", href: "/games", color: "text-purple-500" },
  { icon: MessageCircle, label: "Blog", href: "/blog", color: "text-amber-500" },
  { icon: Trophy, label: "Mentors", href: "/mentorship", color: "text-red-500" },
];

const recentActivity = [
  { icon: Calendar, text: "You RSVP'd to 'AI Workshop 2026'", time: "2 hours ago", color: "text-primary" },
  { icon: BookOpen, text: "Completed 'React Fundamentals' course", time: "1 day ago", color: "text-blue-500" },
  { icon: Coins, text: "Earned 50 coins from daily login", time: "1 day ago", color: "text-amber-500" },
  { icon: MessageCircle, text: "Published a blog post", time: "3 days ago", color: "text-emerald-500" },
  { icon: Gamepad2, text: "Scored 85 in Quiz Battle", time: "5 days ago", color: "text-purple-500" },
];

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [profileRes, leaderboardRes] = await Promise.all([
        supabase.from("profiles").select("full_name, points, level, college, avatar_url").eq("id", user.id).single(),
        supabase.from("profiles").select("id, full_name, points, level, college").order("points", { ascending: false }).limit(10),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (leaderboardRes.data) setLeaderboard(leaderboardRes.data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const { progress, needed } = getLevelProgress(profile?.points ?? 0, profile?.level ?? 1);
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U";

  const userRank = leaderboard.findIndex((e) => e.id === user?.id) + 1;

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-6xl">
          {/* Welcome Header */}
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  Welcome back, <span className="text-gradient">{profile?.full_name || "Student"}</span>! 👋
                </h1>
                <p className="text-muted-foreground text-sm">
                  {profile?.college || "Complete your profile to get personalized recommendations"}
                </p>
              </div>
              <Link to="/profile">
                <Button variant="outline" size="sm">Edit Profile</Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Stats Cards */}
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-[40px]" />
                <CardContent className="pt-6">
                  <Coins className="h-6 w-6 text-amber-500 mb-2" />
                  <div className="text-3xl font-bold">{profile?.points ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Total Coins</div>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-[40px]" />
                <CardContent className="pt-6">
                  <Zap className="h-6 w-6 text-primary mb-2" />
                  <div className="text-3xl font-bold">Lvl {profile?.level ?? 1}</div>
                  <div className="text-xs text-muted-foreground">Current Level</div>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-[40px]" />
                <CardContent className="pt-6">
                  <Trophy className="h-6 w-6 text-emerald-500 mb-2" />
                  <div className="text-3xl font-bold">#{userRank || "—"}</div>
                  <div className="text-xs text-muted-foreground">Global Rank</div>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-[40px]" />
                <CardContent className="pt-6">
                  <Flame className="h-6 w-6 text-red-500 mb-2" />
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>

          {/* Level Progress */}
          <AnimatedSection delay={0.15}>
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground font-bold">
                      {profile?.level ?? 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Level {profile?.level ?? 1}</p>
                      <p className="text-xs text-muted-foreground">{needed} XP to next level</p>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <TrendingUp className="h-3 w-3 mr-1" /> {Math.round(progress)}%
                  </Badge>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Level {profile?.level ?? 1}</span>
                  <span>Level {(profile?.level ?? 1) + 1}</span>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <AnimatedSection delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" /> Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {quickActions.map((action) => (
                        <Link
                          key={action.href}
                          to={action.href}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted transition-colors text-center"
                        >
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                            <action.icon className={`h-5 w-5 ${action.color}`} />
                          </div>
                          <span className="text-xs font-medium">{action.label}</span>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Activity Feed */}
              <AnimatedSection delay={0.25}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Flame className="h-5 w-5 text-red-500" /> Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest actions on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <activity.icon className={`h-4 w-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{activity.text}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            {/* Right Column — Leaderboard */}
            <div>
              <AnimatedSection delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Crown className="h-5 w-5 text-amber-500" /> Leaderboard
                    </CardTitle>
                    <CardDescription>Top students by coins earned</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboard.map((entry, i) => {
                        const RankIcon = rankIcons[i] ?? Star;
                        const rankColor = rankColors[i] ?? "text-muted-foreground";
                        const isCurrentUser = entry.id === user?.id;
                        return (
                          <div
                            key={entry.id}
                            className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${isCurrentUser ? "bg-primary/5 border border-primary/20" : "hover:bg-muted"}`}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                              {i < 3 ? (
                                <RankIcon className={`h-5 w-5 ${rankColor}`} />
                              ) : (
                                <span className="text-sm font-bold text-muted-foreground">#{i + 1}</span>
                              )}
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-muted">
                                {entry.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${isCurrentUser ? "text-primary" : ""}`}>
                                {entry.full_name || "Anonymous"} {isCurrentUser && "(You)"}
                              </p>
                              <p className="text-xs text-muted-foreground">Lvl {entry.level}</p>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-semibold">
                              <Coins className="h-3.5 w-3.5 text-amber-500" />
                              {entry.points}
                            </div>
                          </div>
                        );
                      })}
                      {leaderboard.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">No data yet. Be the first!</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Earn More CTA */}
              <AnimatedSection delay={0.3}>
                <Card className="mt-6 bg-gradient-hero text-primary-foreground">
                  <CardContent className="pt-6 text-center">
                    <Sparkles className="h-8 w-8 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-1">Earn More Coins</h3>
                    <p className="text-sm opacity-90 mb-4">Complete activities to level up and climb the leaderboard!</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { label: "Daily Login", coins: "+10" },
                        { label: "RSVP Event", coins: "+25" },
                        { label: "Write Blog", coins: "+50" },
                        { label: "Win Quiz", coins: "+100" },
                      ].map((item) => (
                        <div key={item.label} className="bg-white/10 rounded-lg p-2">
                          <div className="font-bold">{item.coins}</div>
                          <div className="opacity-80">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
