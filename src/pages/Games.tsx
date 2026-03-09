import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/animated/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Trophy, Target, Brain, Users, Coins, Clock, Sparkles, Zap } from "lucide-react";

interface Game {
  id: string;
  title: string;
  description: string;
  icon: typeof Gamepad2;
  path: string;
  coinsReward: number;
  players: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: "Strategy" | "Trivia" | "Action" | "Auction" | "Puzzle";
  status: "Live" | "Coming Soon";
  gradient: string;
}

const games: Game[] = [
  {
    id: "quiz", title: "Live Quiz Battle",
    description: "Real-time quiz competition with players across India. Test your knowledge and win!",
    icon: Brain, path: "/games/quiz", coinsReward: 50, players: "2-50",
    difficulty: "Medium", category: "Trivia", status: "Coming Soon", gradient: "from-blue-500 to-cyan-400",
  },
  {
    id: "spin-wheel", title: "Lucky Spin Wheel",
    description: "Spin the colorful wheel and win prizes! Test your luck with 3 free spins every game.",
    icon: Target, path: "/games/spin-wheel", coinsReward: 1000, players: "1",
    difficulty: "Easy", category: "Action", status: "Coming Soon", gradient: "from-purple-500 to-pink-400",
  },
  {
    id: "target-master", title: "Target Master",
    description: "Test your precision and reflexes! Click targets before they disappear to score points.",
    icon: Zap, path: "/games/target-master", coinsReward: 75, players: "1",
    difficulty: "Hard", category: "Action", status: "Coming Soon", gradient: "from-orange-500 to-red-400",
  },
  {
    id: "cricket-auction", title: "IPL Cricket Auction",
    description: "Build your dream cricket team in a competitive auction environment!",
    icon: Trophy, path: "/games/cricket-auction", coinsReward: 200, players: "2-8",
    difficulty: "Hard", category: "Auction", status: "Coming Soon", gradient: "from-emerald-500 to-teal-400",
  },
  {
    id: "lucky-draw", title: "Lucky Draw",
    description: "Enter the daily lucky draw for a chance to win exclusive prizes and bonus coins!",
    icon: Sparkles, path: "/games/lucky-draw", coinsReward: 500, players: "Unlimited",
    difficulty: "Easy", category: "Strategy", status: "Coming Soon", gradient: "from-amber-500 to-yellow-400",
  },
  {
    id: "code-challenge", title: "Coding Challenge",
    description: "Solve algorithmic puzzles under time pressure. Compete for the top of the leaderboard!",
    icon: Gamepad2, path: "/games/code-challenge", coinsReward: 100, players: "1-100",
    difficulty: "Hard", category: "Puzzle", status: "Coming Soon", gradient: "from-indigo-500 to-violet-400",
  },
];

const categories = ["All", "Trivia", "Action", "Auction", "Strategy", "Puzzle"];
const difficultyColors: Record<string, string> = {
  Easy: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Hard: "bg-red-500/10 text-red-600 border-red-500/20",
};

const GamesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = games.filter((g) => selectedCategory === "All" || g.category === selectedCategory);

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <AnimatedSection>
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Gamepad2 className="h-3 w-3 mr-1" /> Game Zone
              </Badge>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Play & <span className="text-gradient">Earn</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Compete in interactive games, win coins, and climb the leaderboard. Fun meets learning!
              </p>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
              {[
                { icon: Gamepad2, label: "Games", value: "6+", color: "text-primary" },
                { icon: Coins, label: "Coins to Win", value: "10K+", color: "text-amber-500" },
                { icon: Users, label: "Players", value: "5K+", color: "text-emerald-500" },
              ].map((stat) => (
                <Card key={stat.label} className="text-center">
                  <CardContent className="pt-6">
                    <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>

          {/* Category Filter */}
          <AnimatedSection delay={0.15}>
            <div className="flex gap-2 flex-wrap justify-center mb-8">
              {categories.map((cat) => (
                <Button
                  key={cat} size="sm"
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? "bg-gradient-hero text-primary-foreground" : ""}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </AnimatedSection>

          {/* Game Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((game, i) => (
              <AnimatedSection key={game.id} delay={i * 0.05}>
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow group">
                  <div className={`h-3 bg-gradient-to-r ${game.gradient}`} />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${game.gradient} text-white`}>
                        <game.icon className="h-6 w-6" />
                      </div>
                      <div className="flex gap-2">
                        <Badge className={difficultyColors[game.difficulty]}>{game.difficulty}</Badge>
                        <Badge variant={game.status === "Live" ? "default" : "secondary"}>
                          {game.status}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-3">{game.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pb-2">
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Coins className="h-3 w-3 text-amber-500" />{game.coinsReward} coins</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{game.players} players</span>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4">
                    <Button
                      className={`w-full bg-gradient-to-r ${game.gradient} text-white hover:opacity-90`}
                      disabled={game.status === "Coming Soon"}
                      onClick={() => navigate(game.path)}
                    >
                      {game.status === "Live" ? "Play Now" : "Coming Soon"}
                    </Button>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GamesPage;
