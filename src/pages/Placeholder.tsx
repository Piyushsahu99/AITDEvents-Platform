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



export const Scholarships = () => <PlaceholderPage title="Scholarships" description="Financial aid opportunities for students. Coming soon!" />;
export const Bounties = () => <PlaceholderPage title="Bounties & Rewards" description="Solve technical challenges and earn rewards. Coming soon!" />;
export const Contact = () => <PlaceholderPage title="Contact Us" description="Get in touch with the AITD Events team. Coming soon!" />;
export const Leaderboard = () => <PlaceholderPage title="Leaderboard" description="Compete and climb the global rankings. Coming soon!" />;
export const Ambassador = () => <PlaceholderPage title="Campus Ambassador" description="Join the ambassador program and lead on campus. Coming soon!" />;
