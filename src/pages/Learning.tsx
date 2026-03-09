import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/animated/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen, Play, Youtube, GraduationCap, ExternalLink,
  Search, Clock, Star, Users, Globe, TrendingUp, Award, Sparkles
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: string;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  rating: number;
  students: string;
  isFree: boolean;
  link: string;
  image: string;
}

interface Playlist {
  id: string;
  title: string;
  channel: string;
  videos: number;
  category: string;
  link: string;
}

const courses: Course[] = [
  {
    id: "1", title: "Complete Web Development Bootcamp", description: "Learn HTML, CSS, JS, React, Node.js and more from scratch.",
    category: "Web Development", platform: "Udemy", instructor: "Dr. Angela Yu", level: "Beginner",
    duration: "65 hours", rating: 4.7, students: "800K+", isFree: false, link: "#",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop"
  },
  {
    id: "2", title: "Machine Learning A-Z", description: "Hands-on Python & R in Data Science with real-world projects.",
    category: "Data Science", platform: "Coursera", instructor: "Andrew Ng", level: "Intermediate",
    duration: "40 hours", rating: 4.9, students: "1.2M+", isFree: true, link: "#",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop"
  },
  {
    id: "3", title: "Flutter & Dart Complete Guide", description: "Build beautiful native mobile apps for iOS and Android.",
    category: "Mobile Development", platform: "Udemy", instructor: "Maximilian Schwarzmüller", level: "Beginner",
    duration: "42 hours", rating: 4.6, students: "300K+", isFree: false, link: "#",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop"
  },
  {
    id: "4", title: "AWS Cloud Practitioner Essentials", description: "Prepare for the AWS Cloud Practitioner certification exam.",
    category: "Cloud Computing", platform: "AWS", instructor: "Amazon Web Services", level: "Beginner",
    duration: "6 hours", rating: 4.8, students: "500K+", isFree: true, link: "#",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop"
  },
  {
    id: "5", title: "UI/UX Design Masterclass", description: "Learn Figma, design thinking, and create stunning interfaces.",
    category: "Design", platform: "Skillshare", instructor: "Daniel Scott", level: "Beginner",
    duration: "25 hours", rating: 4.5, students: "150K+", isFree: false, link: "#",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop"
  },
  {
    id: "6", title: "DSA with Java", description: "Master data structures and algorithms for coding interviews.",
    category: "Programming", platform: "YouTube", instructor: "Kunal Kushwaha", level: "Intermediate",
    duration: "100+ videos", rating: 4.9, students: "2M+", isFree: true, link: "#",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop"
  },
];

const playlists: Playlist[] = [
  { id: "1", title: "Python for Beginners", channel: "Programming with Mosh", videos: 12, category: "Programming", link: "#" },
  { id: "2", title: "React JS Crash Course", channel: "Traversy Media", videos: 8, category: "Web Development", link: "#" },
  { id: "3", title: "Git & GitHub Tutorial", channel: "freeCodeCamp", videos: 5, category: "Tools", link: "#" },
  { id: "4", title: "System Design for Beginners", channel: "Gaurav Sen", videos: 20, category: "System Design", link: "#" },
  { id: "5", title: "SQL Full Course", channel: "Bro Code", videos: 10, category: "Database", link: "#" },
  { id: "6", title: "Docker in 1 Hour", channel: "TechWorld with Nana", videos: 6, category: "DevOps", link: "#" },
];

const categories = ["All", "Web Development", "Data Science", "Mobile Development", "Cloud Computing", "Design", "Programming"];

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-600 border-red-500/20",
};

const Learning = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <AnimatedSection>
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <GraduationCap className="h-3 w-3 mr-1" /> Learning Hub
              </Badge>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Level Up Your <span className="text-gradient">Skills</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Access 200+ curated courses, study materials, and YouTube playlists to boost your career.
              </p>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { icon: BookOpen, label: "Courses", value: "200+", color: "text-primary" },
                { icon: Youtube, label: "Video Playlists", value: "50+", color: "text-red-500" },
                { icon: Users, label: "Learners", value: "50K+", color: "text-emerald-500" },
                { icon: Award, label: "Certificates", value: "Free", color: "text-amber-500" },
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

          {/* Search & Filter */}
          <AnimatedSection delay={0.15}>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search courses, topics..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={selectedCategory === cat ? "default" : "outline"}
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? "bg-gradient-hero text-primary-foreground" : ""}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <Tabs defaultValue="courses" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="courses"><BookOpen className="h-4 w-4 mr-2" />Courses</TabsTrigger>
              <TabsTrigger value="playlists"><Youtube className="h-4 w-4 mr-2" />YouTube Playlists</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course, i) => (
                  <AnimatedSection key={course.id} delay={i * 0.05}>
                    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
                      <div className="relative h-40 overflow-hidden">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute top-3 right-3 flex gap-2">
                          {course.isFree && <Badge className="bg-emerald-500 text-white">Free</Badge>}
                          <Badge className={levelColors[course.level]}>{course.level}</Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <Globe className="h-3 w-3" /> {course.platform}
                          <span>•</span>
                          <Clock className="h-3 w-3" /> {course.duration}
                        </div>
                        <CardTitle className="text-base line-clamp-2">{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                        <div className="text-xs text-muted-foreground mb-1">by {course.instructor}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{course.rating}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.students}</span>
                        </div>
                      </CardContent>
                      <div className="px-6 pb-4">
                        <Button size="sm" className="w-full bg-gradient-hero text-primary-foreground">
                          <ExternalLink className="h-3 w-3 mr-2" /> Enroll Now
                        </Button>
                      </div>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
              {filteredCourses.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No courses found matching your search.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="playlists">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {playlists.map((pl, i) => (
                  <AnimatedSection key={pl.id} delay={i * 0.05}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="flex items-center gap-4 py-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                          <Play className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{pl.title}</h3>
                          <p className="text-xs text-muted-foreground">{pl.channel} • {pl.videos} videos</p>
                          <Badge variant="outline" className="mt-1 text-xs">{pl.category}</Badge>
                        </div>
                        <Button size="icon" variant="ghost" asChild>
                          <a href={pl.link} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                        </Button>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Learning;
