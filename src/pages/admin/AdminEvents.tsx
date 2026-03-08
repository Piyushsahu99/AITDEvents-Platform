import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentTable, { Column, StatusBadge } from "@/components/admin/ContentTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

const columns: Column[] = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "date", label: "Date", render: (v) => v ? format(new Date(v), "MMM d, yyyy") : "—" },
  { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
];

const AdminEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", date: "", description: "", location: "", venue: "", status: "draft" as string, max_participants: "" });

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setEvents(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleCreate = async () => {
    if (!form.title || !form.date) {
      toast({ title: "Title and date are required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("events").insert({
      title: form.title,
      category: form.category || null,
      date: new Date(form.date).toISOString(),
      description: form.description || null,
      location: form.location || null,
      venue: form.venue || null,
      status: form.status as any,
      max_participants: form.max_participants ? parseInt(form.max_participants) : null,
      created_by: user?.id ?? null,
    });
    if (error) {
      toast({ title: "Error creating event", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Event created!" });
      setOpen(false);
      setForm({ title: "", category: "", date: "", description: "", location: "", venue: "", status: "draft", max_participants: "" });
      fetchEvents();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
  };

  return (
    <AdminLayout
      title="Events"
      description="Create and manage events"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-hero text-primary-foreground"><Plus className="h-4 w-4 mr-2" />New Event</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create Event</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Workshop" /></div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Date *</Label><Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                <div><Label>Venue</Label><Input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
              </div>
              <div><Label>Max Participants</Label><Input type="number" value={form.max_participants} onChange={(e) => setForm({ ...form, max_participants: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} /></div>
              <Button className="w-full bg-gradient-hero text-primary-foreground" onClick={handleCreate}>Create Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <ContentTable columns={columns} data={events} loading={loading} onDelete={handleDelete} />
    </AdminLayout>
  );
};

export default AdminEvents;
