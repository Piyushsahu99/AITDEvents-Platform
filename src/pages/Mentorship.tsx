import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/animated/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Users, Star, Clock, Calendar, MessageCircle, Search,
  Award, CheckCircle, Briefcase, GraduationCap, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  rating: number;
  sessions: number;
  isVerified: boolean;
  bio: string;
  college: string;
  rate: number;
}

const mentors: Mentor[] = [
  {
    id: "1", name: "Priya Sharma", title: "Senior SDE @ Google", expertise: ["Web Development", "System Design", "Interview Prep"],
    rating: 4.9, sessions: 120, isVerified: true, bio: "5+ years at Google. Passionate about helping students crack FAANG interviews.",
    college: "IIT Delhi", rate: 0,
  },
  {
    id: "2", name: "Rahul Verma", title: "ML Engineer @ Microsoft", expertise: ["Machine Learning", "Data Science", "Python"],
    rating: 4.8, sessions: 85, isVerified: true, bio: "Kaggle Grandmaster. Published 3 research papers in NeurIPS.",
    college: "IIT Bombay", rate: 50,
  },
  {
    id: "3", name: "Ananya Gupta", title: "Product Designer @ Figma", expertise: ["UI/UX Design", "Design Thinking", "Portfolio Review"],
    rating: 4.7, sessions: 60, isVerified: true, bio: "Helped 200+ students build stunning portfolios. Former Flipkart designer.",
    college: "NID Ahmedabad", rate: 0,
  },
  {
    id: "4", name: "Vikram Singh", title: "DevOps Lead @ Amazon", expertise: ["Cloud Computing", "DevOps", "AWS"],
    rating: 4.6, sessions: 45, isVerified: false, bio: "AWS Solutions Architect. 8 years of cloud infrastructure experience.",
    college: "BITS Pilani", rate: 100,
  },
  {
    id: "5", name: "Sneha Patel", title: "Startup Founder & CEO", expertise: ["Career Guidance", "Entrepreneurship", "Resume Review"],
    rating: 4.9, sessions: 200, isVerified: true, bio: "Founded 2 startups. Angel investor. Loves mentoring aspiring entrepreneurs.",
    college: "ISB Hyderabad", rate: 0,
  },
  {
    id: "6", name: "Arjun Menon", title: "Backend Engineer @ Stripe", expertise: ["Backend Development", "Distributed Systems", "Go"],
    rating: 4.8, sessions: 70, isVerified: true, bio: "Previously at Uber. Expert in building scalable microservices.",
    college: "IIIT Hyderabad", rate: 75,
  },
];

const expertiseOptions = [
  "All", "Web Development", "Machine Learning", "Data Science", "UI/UX Design",
  "Cloud Computing", "DevOps", "Career Guidance", "Interview Prep", "Resume Review",
];

const Mentorship = () => {
  const [search, setSearch] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("All");
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const filtered = mentors.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.title.toLowerCase().includes(search.toLowerCase());
    const matchesExpertise = selectedExpertise === "All" || m.expertise.includes(selectedExpertise);
    return matchesSearch && matchesExpertise;
  });

  const handleBook = () => {
    toast({ title: "Request Sent!", description: `Your mentorship request to ${bookingMentor?.name} has been submitted.` });
    setBookingMentor(null);
    setMessage("");
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <AnimatedSection>
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Users className="h-3 w-3 mr-1" /> Mentorship
              </Badge>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Learn from the <span className="text-gradient">Best</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Connect with 100+ industry mentors from top companies for career guidance, mock interviews, and skill development.
              </p>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { icon: Users, label: "Mentors", value: "100+", color: "text-primary" },
                { icon: Star, label: "Avg Rating", value: "4.8", color: "text-amber-500" },
                { icon: Calendar, label: "Sessions Done", value: "5K+", color: "text-emerald-500" },
                { icon: Award, label: "FAANG Mentors", value: "30+", color: "text-purple-500" },
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
                <Input placeholder="Search mentors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
              <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue placeholder="Filter by expertise" />
                </SelectTrigger>
                <SelectContent>
                  {expertiseOptions.map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AnimatedSection>

          {/* Mentor Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((mentor, i) => (
              <AnimatedSection key={mentor.id} delay={i * 0.05}>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-14 w-14 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {mentor.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base truncate">{mentor.name}</CardTitle>
                          {mentor.isVerified && <CheckCircle className="h-4 w-4 text-primary shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{mentor.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <GraduationCap className="h-3 w-3" /> {mentor.college}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 pb-2 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{mentor.bio}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.expertise.map((e) => (
                        <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{mentor.rating}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{mentor.sessions} sessions</span>
                      <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" />{mentor.rate === 0 ? "Free" : `₹${mentor.rate}/session`}</span>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4">
                    <Button
                      className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90"
                      onClick={() => setBookingMentor(mentor)}
                    >
                      Book Session
                    </Button>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No mentors found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={!!bookingMentor} onOpenChange={() => setBookingMentor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Session with {bookingMentor?.name}</DialogTitle>
            <DialogDescription>
              {bookingMentor?.title} • {bookingMentor?.rate === 0 ? "Free" : `₹${bookingMentor?.rate}/session`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">What do you want to discuss?</label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your goals, questions, or areas you need help with..." rows={4} className="mt-1.5" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingMentor(null)}>Cancel</Button>
            <Button onClick={handleBook} disabled={!message.trim()} className="bg-gradient-hero text-primary-foreground">Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Mentorship;
