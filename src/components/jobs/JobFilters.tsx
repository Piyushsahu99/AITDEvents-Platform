import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  activeType: string;
  onTypeChange: (v: string) => void;
  activeLocation: string;
  onLocationChange: (v: string) => void;
  locations: string[];
}

const jobTypes = ["All", "Internship", "Full Time", "Part Time", "Freelance"];

const typeValueMap: Record<string, string> = {
  All: "All",
  Internship: "internship",
  "Full Time": "full_time",
  "Part Time": "part_time",
  Freelance: "freelance",
};

const JobFilters = ({
  search, onSearchChange,
  activeType, onTypeChange,
  activeLocation, onLocationChange,
  locations,
}: JobFiltersProps) => (
  <div className="space-y-4">
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search jobs, companies..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>

    <div className="flex flex-wrap gap-2">
      {jobTypes.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(typeValueMap[type])}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            activeType === typeValueMap[type]
              ? "bg-gradient-cool text-primary-foreground shadow-elegant"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          {type}
        </button>
      ))}
    </div>

    {locations.length > 1 && (
      <div className="flex flex-wrap gap-2">
        {["All Locations", ...locations].map((loc) => (
          <button
            key={loc}
            onClick={() => onLocationChange(loc === "All Locations" ? "All" : loc)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all border",
              (loc === "All Locations" ? "All" : loc) === activeLocation
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {loc}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default JobFilters;
