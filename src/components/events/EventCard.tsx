import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { format, isPast } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";

interface EventCardProps {
  event: Tables<"events"> & { rsvp_count?: number; user_rsvp?: boolean };
  onRsvp: (eventId: string) => void;
  onCancelRsvp: (eventId: string) => void;
  isAuthenticated: boolean;
  rsvpLoading?: string | null;
}

const categoryColors: Record<string, string> = {
  hackathon: "bg-gradient-hero text-primary-foreground",
  workshop: "bg-gradient-cool text-primary-foreground",
  webinar: "bg-gradient-accent text-accent-foreground",
  meetup: "bg-gradient-success text-primary-foreground",
  competition: "bg-gradient-primary text-primary-foreground",
};

const EventCard = ({ event, onRsvp, onCancelRsvp, isAuthenticated, rsvpLoading }: EventCardProps) => {
  const eventDate = new Date(event.date);
  const isEventPast = isPast(event.end_date ? new Date(event.end_date) : eventDate);
  const isFull = event.max_participants ? (event.rsvp_count ?? 0) >= event.max_participants : false;
  const loading = rsvpLoading === event.id;

  return (
    <Card className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-elegant hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-events">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Calendar className="h-16 w-16 text-primary-foreground/40" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {event.category && (
            <Badge className={categoryColors[event.category.toLowerCase()] ?? "bg-primary text-primary-foreground"}>
              {event.category}
            </Badge>
          )}
          {event.status === "completed" && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">Completed</Badge>
          )}
        </div>
        {/* Date chip */}
        <div className="absolute top-3 right-3 flex flex-col items-center rounded-xl bg-background/90 backdrop-blur-sm px-3 py-1.5 shadow-sm">
          <span className="text-xs font-semibold uppercase text-muted-foreground">{format(eventDate, "MMM")}</span>
          <span className="text-lg font-bold leading-tight text-foreground">{format(eventDate, "dd")}</span>
        </div>
      </div>

      <CardContent className="p-5 space-y-3">
        <h3 className="font-display text-lg font-bold leading-snug text-foreground line-clamp-2 group-hover:text-gradient-primary transition-colors">
          {event.title}
        </h3>

        {event.short_description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{event.short_description}</p>
        )}

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{format(eventDate, "EEE, MMM d · h:mm a")}</span>
          </div>
          {(event.venue || event.location) && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{event.venue || event.location}</span>
            </div>
          )}
          {event.max_participants && (
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span>{event.rsvp_count ?? 0}/{event.max_participants} registered</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="pt-2">
          {isEventPast ? (
            <Button variant="secondary" className="w-full" disabled>Event Ended</Button>
          ) : event.user_rsvp ? (
            <Button variant="outline" className="w-full" onClick={() => onCancelRsvp(event.id)} disabled={loading}>
              {loading ? "Cancelling..." : "Cancel RSVP"}
            </Button>
          ) : event.registration_link ? (
            <Button asChild className="w-full bg-gradient-hero hover:opacity-90">
              <a href={event.registration_link} target="_blank" rel="noopener noreferrer">Register Now</a>
            </Button>
          ) : (
            <Button
              className="w-full bg-gradient-hero hover:opacity-90"
              onClick={() => onRsvp(event.id)}
              disabled={!isAuthenticated || isFull || loading}
            >
              {loading ? "Registering..." : isFull ? "Event Full" : isAuthenticated ? "RSVP Now" : "Sign in to RSVP"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
