import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar, Briefcase, GraduationCap, Gamepad2,
  BookOpen, Users, Trophy, Rocket,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Events & Hackathons",
    description: "Discover 500+ competitions, workshops, and webinars. RSVP and track your participation.",
    href: "/events",
    gradient: "bg-gradient-events",
  },
  {
    icon: Briefcase,
    title: "Jobs & Internships",
    description: "Access 1000+ opportunities from top companies. One-click apply with tracking.",
    href: "/jobs",
    gradient: "bg-gradient-jobs",
  },
  {
    icon: GraduationCap,
    title: "Learning Hub",
    description: "200+ courses, study materials, practice tests with certificate generation.",
    href: "/learning",
    gradient: "bg-gradient-courses",
  },
  {
    icon: Gamepad2,
    title: "Interactive Games",
    description: "IPL Auction, quizzes, target master. Earn coins while having fun!",
    href: "/games",
    gradient: "bg-gradient-bounties",
  },
  {
    icon: Users,
    title: "Mentorship",
    description: "Connect with 100+ industry mentors for 1-on-1 career guidance sessions.",
    href: "/mentorship",
    gradient: "bg-gradient-mentorship",
  },
  {
    icon: Trophy,
    title: "Bounties & Rewards",
    description: "Solve technical challenges, earn rewards, and compete on leaderboards.",
    href: "/bounties",
    gradient: "bg-gradient-scholarships",
  },
  {
    icon: BookOpen,
    title: "Blog & Community",
    description: "Share knowledge with markdown blogs, engage in discussions, and grow together.",
    href: "/blog",
    gradient: "bg-gradient-practice",
  },
  {
    icon: Rocket,
    title: "AI-Powered Tools",
    description: "Resume builder, AI chat assistant, smart career recommendations.",
    href: "/ai-tools",
    gradient: "bg-gradient-network",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to{" "}
            <span className="text-gradient">Succeed</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            One platform with all the tools, resources, and opportunities to launch your career.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Link
                to={feature.href}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/20"
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feature.gradient}`}>
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-2 font-display text-base font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
