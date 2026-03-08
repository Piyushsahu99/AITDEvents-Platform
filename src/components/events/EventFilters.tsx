import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = ["All", "Hackathon", "Workshop", "Webinar", "Meetup", "Competition"];

interface EventFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  activeCategory: string;
  onCategoryChange: (v: string) => void;
}

const EventFilters = ({ search, onSearchChange, activeCategory, onCategoryChange }: EventFiltersProps) => (
  <div className="space-y-4">
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search events..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={activeCategory === cat ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(cat)}
          className={activeCategory === cat ? "bg-gradient-hero hover:opacity-90 text-primary-foreground" : ""}
        >
          {cat}
        </Button>
      ))}
    </div>
  </div>
);

export default EventFilters;
