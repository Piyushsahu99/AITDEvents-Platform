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
import type { Tables } from "@/integrations/supabase/types";

type Job = Tables<"jobs">;

const columns: Column[] = [
  { key: "title", label: "Title" },
  { key: "company", label: "Company" },
  { key: "job_type", label: "Type" },
  { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
];

const AdminJobs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", job_type: "internship", location: "", salary_range: "", apply_link: "", description: "", status: "draft", deadline: "" });

  const fetchJobs = async () => {
    const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
    setJobs(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleCreate = async () => {
    if (!form.title || !form.company) {
      toast({ title: "Title and company are required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("jobs").insert({
      title: form.title,
      company: form.company,
      job_type: form.job_type as any,
      location: form.location || null,
      salary_range: form.salary_range || null,
      apply_link: form.apply_link || null,
      description: form.description || null,
      status: form.status as any,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      created_by: user?.id ?? null,
    });
    if (error) {
      toast({ title: "Error creating job", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Job created!" });
      setOpen(false);
      setForm({ title: "", company: "", job_type: "internship", location: "", salary_range: "", apply_link: "", description: "", status: "draft", deadline: "" });
      fetchJobs();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("jobs").delete().eq("id", id);
    fetchJobs();
  };

  return (
    <AdminLayout
      title="Jobs"
      description="Manage job & internship listings"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-hero text-primary-foreground"><Plus className="h-4 w-4 mr-2" />New Job</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create Job</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Company *</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
                <div>
                  <Label>Type</Label>
                  <Select value={form.job_type} onValueChange={(v) => setForm({ ...form, job_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                <div><Label>Salary Range</Label><Input value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} placeholder="e.g. ₹10k-20k/mo" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Deadline</Label><Input type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
              </div>
              <div><Label>Apply Link</Label><Input value={form.apply_link} onChange={(e) => setForm({ ...form, apply_link: e.target.value })} placeholder="https://..." /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} /></div>
              <Button className="w-full bg-gradient-hero text-primary-foreground" onClick={handleCreate}>Create Job</Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <ContentTable columns={columns} data={jobs} loading={loading} onDelete={handleDelete} />
    </AdminLayout>
  );
};

export default AdminJobs;
