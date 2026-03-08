import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

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
      <div className="container py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                AITD Events
              </span>
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
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
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
