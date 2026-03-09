import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  FileText,
  Users,
  Gamepad2,
  BarChart3,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { label: "Blog Posts", href: "/admin/blog", icon: FileText },
  { label: "Games", href: "/admin/games", icon: Gamepad2 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center">
          <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-display text-lg font-bold">Admin</span>
      </div>

      <nav className="space-y-1 p-4">
        {links.map((link) => {
          const active = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border p-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
