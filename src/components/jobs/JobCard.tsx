import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Banknote, ExternalLink, Building2 } from "lucide-react";
import { format } from "date-fns";
import { UniversalShareButton } from "@/components/UniversalShareButton";
import type { Tables } from "@/integrations/supabase/types";

type Job = Tables<"jobs">;

const typeLabels: Record<string, string> = {
  internship: "Internship",
  full_time: "Full Time",
  part_time: "Part Time",
  freelance: "Freelance",
};

const typeGradients: Record<string, string> = {
  internship: "bg-gradient-cool",
  full_time: "bg-gradient-primary",
  part_time: "bg-gradient-accent",
  freelance: "bg-gradient-events",
};

const JobCard = ({ job }: { job: Job }) => {
  const hasDeadline = !!job.deadline;
  const isPast = hasDeadline && new Date(job.deadline!) < new Date();

  return (
    <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-card-hover hover:-translate-y-0.5">
      {/* Type badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="font-medium">{job.company}</span>
          </div>
        </div>
        <Badge className={`${typeGradients[job.job_type]} text-primary-foreground border-0 shrink-0`}>
          {typeLabels[job.job_type] ?? job.job_type}
        </Badge>
      </div>

      {/* Description */}
      {job.description && (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{job.description}</p>
      )}

      {/* Meta */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        {job.location && (
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
        )}
        {job.salary_range && (
          <span className="flex items-center gap-1"><Banknote className="h-3 w-3" />{job.salary_range}</span>
        )}
        {hasDeadline && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {isPast ? "Expired" : `Due ${format(new Date(job.deadline!), "MMM d, yyyy")}`}
          </span>
        )}
      </div>

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Apply */}
      {job.apply_link && (
        <div className="mt-4">
          <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-gradient-cool text-primary-foreground hover:opacity-90 w-full">
              Apply Now <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </a>
        </div>
      )}
    </div>
  );
};

export default JobCard;
