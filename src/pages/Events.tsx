import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import EventCard from "@/components/events/EventCard";
import EventFilters from "@/components/events/EventFilters";
import { SkeletonGrid, SkeletonEventCard } from "@/components/ui/skeleton-loader";
import { AnimatedSection, AnimatedStagger, AnimatedStaggerItem } from "@/components/animated/AnimatedSection";
import { CalendarDays } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type EventWithMeta = Tables<"events"> & { rsvp_count?: number; user_rsvp?: boolean };

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    // Fetch events
    const { data: eventsData, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
      return;
    }

    // Fetch RSVP counts
    const { data: rsvpCounts } = await supabase
      .from("event_rsvps")
      .select("event_id");

    // Fetch user RSVPs
    let userRsvps: string[] = [];
    if (user) {
      const { data } = await supabase
        .from("event_rsvps")
        .select("event_id")
        .eq("user_id", user.id);
      userRsvps = (data ?? []).map((r) => r.event_id);
    }

    // Count RSVPs per event
    const countMap: Record<string, number> = {};
    (rsvpCounts ?? []).forEach((r) => {
      countMap[r.event_id] = (countMap[r.event_id] ?? 0) + 1;
    });

    const enriched = (eventsData ?? []).map((e) => ({
      ...e,
      rsvp_count: countMap[e.id] ?? 0,
      user_rsvp: userRsvps.includes(e.id),
    }));

    setEvents(enriched);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleRsvp = async (eventId: string) => {
    if (!user) return;
    setRsvpLoading(eventId);
    const { error } = await supabase.from("event_rsvps").insert({ event_id: eventId, user_id: user.id });
    if (error) {
      toast({ title: "RSVP failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "You're registered! 🎉", description: "See you at the event." });
      // Optimistic update
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, user_rsvp: true, rsvp_count: (e.rsvp_count ?? 0) + 1 } : e))
      );
    }
    setRsvpLoading(null);
  };

  const handleCancelRsvp = async (eventId: string) => {
    if (!user) return;
    setRsvpLoading(eventId);
    const { error } = await supabase.from("event_rsvps").delete().eq("event_id", eventId).eq("user_id", user.id);
    if (error) {
      toast({ title: "Cancel failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "RSVP cancelled" });
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, user_rsvp: false, rsvp_count: Math.max((e.rsvp_count ?? 1) - 1, 0) } : e))
      );
    }
    setRsvpLoading(null);
  };

  // Filter
  const filtered = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.short_description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || (e.category ?? "").toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <section className="container py-12 space-y-8">
        {/* Header */}
        <AnimatedSection>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-events">
                <CalendarDays className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Events & <span className="text-gradient">Hackathons</span>
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Discover upcoming competitions, workshops, webinars, and meetups. Register and never miss an opportunity.
            </p>
          </div>
        </AnimatedSection>

        {/* Filters */}
        <AnimatedSection delay={0.1}>
          <EventFilters search={search} onSearchChange={setSearch} activeCategory={category} onCategoryChange={setCategory} />
        </AnimatedSection>

        {/* Grid */}
        {loading ? (
          <SkeletonGrid count={6} component={SkeletonEventCard} />
        ) : filtered.length === 0 ? (
          <AnimatedSection>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <CalendarDays className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground">No events found</h3>
              <p className="text-muted-foreground mt-1">Check back soon for upcoming events!</p>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedStagger staggerDelay={0.08} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <AnimatedStaggerItem key={event.id}>
                <EventCard
                  event={event}
                  onRsvp={handleRsvp}
                  onCancelRsvp={handleCancelRsvp}
                  isAuthenticated={!!user}
                  rsvpLoading={rsvpLoading}
                />
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        )}
      </section>
    </Layout>
  );
};

export default Events;
