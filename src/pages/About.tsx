import Layout from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/animated/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Target, Rocket, Users, Trophy, GraduationCap, Building, Zap, Globe,
  TrendingUp, Award, Lightbulb, Heart, Linkedin, Twitter, Instagram, ArrowRight
} from "lucide-react";

const stats = [
  { icon: Users, value: "50,000+", label: "Students", color: "text-primary" },
  { icon: Trophy, value: "500+", label: "Events", color: "text-amber-500" },
  { icon: Building, value: "1,000+", label: "Opportunities", color: "text-emerald-500" },
  { icon: GraduationCap, value: "200+", label: "Courses", color: "text-purple-500" },
  { icon: Globe, value: "100+", label: "Colleges", color: "text-blue-500" },
  { icon: Award, value: "100+", label: "Mentors", color: "text-red-500" },
];

const values = [
  { icon: Lightbulb, title: "Innovation First", description: "We believe in building cutting-edge solutions that transform how students discover opportunities." },
  { icon: Heart, title: "Student-Centric", description: "Every feature we build starts with the student experience. Your success is our mission." },
  { icon: Users, title: "Community Driven", description: "We foster a vibrant community where students help each other grow and succeed." },
  { icon: Zap, title: "Accessibility", description: "Quality opportunities should be accessible to every student, regardless of their background." },
];

const team = [
  { name: "Piyush Sahu", role: "Founder & Director", description: "Visionary leader passionate about bridging the gap between students and opportunities." },
];

const About = () => (
  <Layout>
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Hero */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Rocket className="h-3 w-3 mr-1" /> About Us
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              India's Largest Student <span className="text-gradient">Opportunity Hub</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              AITD Events connects students with career-defining opportunities — hackathons, internships, jobs, scholarships, and mentorship, all in one platform.
            </p>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-16">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className={`h-7 w-7 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        {/* Mission */}
        <AnimatedSection delay={0.15}>
          <div className="grid gap-8 md:gap-10 md:grid-cols-2 items-center mb-16">
            <div>
              <Badge className="mb-3 bg-amber-500/10 text-amber-600 border-amber-500/20">
                <Target className="h-3 w-3 mr-1" /> Our Mission
              </Badge>
              <h2 className="font-display text-3xl font-bold mb-4">
                Empowering Every Student to <span className="text-gradient">Succeed</span>
              </h2>
              <p className="text-muted-foreground mb-4">
                We started AITD Events with a simple belief: every student deserves access to the best opportunities, regardless of which college they attend or where they come from.
              </p>
              <p className="text-muted-foreground mb-6">
                Today, we're building a comprehensive platform that aggregates hackathons, internships, jobs, courses, and mentorship into one seamless experience — making opportunity discovery effortless.
              </p>
              <div className="flex gap-3">
                <Link to="/events">
                  <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                    Explore Events <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline">Browse Jobs</Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((val) => (
                <Card key={val.title} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <val.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold text-sm mb-1">{val.title}</h3>
                    <p className="text-xs text-muted-foreground">{val.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Team */}
        <AnimatedSection delay={0.2}>
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-purple-500/10 text-purple-600 border-purple-500/20">
              <Users className="h-3 w-3 mr-1" /> Our Team
            </Badge>
            <h2 className="font-display text-3xl font-bold">
              Meet the <span className="text-gradient">Team</span>
            </h2>
          </div>
          <div className="max-w-md mx-auto mb-16">
            {team.map((member) => (
              <Card key={member.name} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-hero mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                  <p className="text-sm text-muted-foreground mt-2">{member.description}</p>
                  <div className="flex justify-center gap-3 mt-4">
                    <Button size="icon" variant="ghost"><Linkedin className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost"><Twitter className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost"><Instagram className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={0.25}>
          <Card className="bg-gradient-hero text-primary-foreground">
            <CardContent className="py-12 text-center">
              <h2 className="font-display text-3xl font-bold mb-3">Ready to Get Started?</h2>
              <p className="opacity-90 mb-6 max-w-md mx-auto">
                Join 50,000+ students already using AITD Events to discover their next big opportunity.
              </p>
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Join Now — It's Free <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  </Layout>
);

export default About;
