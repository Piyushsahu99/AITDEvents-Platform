import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Events", href: "/events" },
    { label: "Jobs & Internships", href: "/jobs" },
    { label: "Learning Hub", href: "/learning" },
    { label: "Mentorship", href: "/mentorship" },
    { label: "Scholarships", href: "/scholarships" },
  ],
  Community: [
    { label: "Blog", href: "/blog" },
    { label: "Games", href: "/games" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Ambassador Program", href: "/ambassador" },
    { label: "Bounties", href: "/bounties" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-accent to-primary-glow rotate-6 opacity-80" />
                <div className="absolute inset-0 rounded-xl bg-gradient-hero" />
                <span className="relative font-display text-base font-black text-primary-foreground tracking-tighter leading-none">A</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-extrabold tracking-tight">AITD</span>
                <span className="text-gradient font-display text-xs font-bold tracking-widest uppercase">Events</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
              India's largest student opportunity hub. Connecting students with career-defining hackathons, internships, jobs, scholarships, and mentorship.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 font-display text-sm font-semibold tracking-wide text-foreground">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AITD Events. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-3.5 w-3.5 fill-accent text-accent" /> by AITD Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
