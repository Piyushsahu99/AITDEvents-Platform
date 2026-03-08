import Layout from "@/components/layout/Layout";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => (
  <Layout>
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center py-20">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero">
        <Construction className="h-8 w-8 text-primary-foreground" />
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">{description}</p>
    </div>
  </Layout>
);


export const Jobs = () => <PlaceholderPage title="Jobs & Internships" description="Access 1000+ opportunities from top companies. Coming soon!" />;
export const Learning = () => <PlaceholderPage title="Learning Hub" description="200+ courses, study materials, and practice resources. Coming soon!" />;
export const Games = () => <PlaceholderPage title="Interactive Games" description="IPL Auction, quizzes, and more. Earn coins while having fun! Coming soon!" />;
export const Blog = () => <PlaceholderPage title="Blog & Community" description="Share knowledge, engage in discussions, and grow together. Coming soon!" />;
export const Mentorship = () => <PlaceholderPage title="Mentorship" description="Connect with 100+ industry mentors for career guidance. Coming soon!" />;
export const Scholarships = () => <PlaceholderPage title="Scholarships" description="Financial aid opportunities for students. Coming soon!" />;
export const Bounties = () => <PlaceholderPage title="Bounties & Rewards" description="Solve technical challenges and earn rewards. Coming soon!" />;
export const About = () => <PlaceholderPage title="About AITD Events" description="India's largest student opportunity hub. Coming soon!" />;
export const Contact = () => <PlaceholderPage title="Contact Us" description="Get in touch with the AITD Events team. Coming soon!" />;
export const Auth = () => <PlaceholderPage title="Sign In / Sign Up" description="Create your account to unlock all features. Coming soon!" />;
export const Leaderboard = () => <PlaceholderPage title="Leaderboard" description="Compete and climb the global rankings. Coming soon!" />;
export const Ambassador = () => <PlaceholderPage title="Campus Ambassador" description="Join the ambassador program and lead on campus. Coming soon!" />;
