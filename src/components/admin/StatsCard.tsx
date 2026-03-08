import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  gradient: string;
}

const StatsCard = ({ title, value, icon: Icon, gradient }: StatsCardProps) => (
  <div className="rounded-xl border border-border bg-card p-6 flex items-center gap-4">
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${gradient}`}>
      <Icon className="h-6 w-6 text-primary-foreground" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold font-display">{value}</p>
    </div>
  </div>
);

export default StatsCard;
