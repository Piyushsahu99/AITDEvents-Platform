import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import { SkeletonGrid, SkeletonJobCard } from "@/components/ui/skeleton-loader";
import { AnimatedSection, AnimatedStagger, AnimatedStaggerItem } from "@/components/animated/AnimatedSection";
import { Briefcase } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Job = Tables<"jobs">;

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("All");
  const [location, setLocation] = useState("All");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      setJobs(data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const locations = useMemo(
    () => [...new Set(jobs.map((j) => j.location).filter(Boolean) as string[])].sort(),
    [jobs]
  );

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchesSearch =
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        (j.description ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesType = jobType === "All" || j.job_type === jobType;
      const matchesLocation = location === "All" || j.location === location;
      return matchesSearch && matchesType && matchesLocation;
    });
  }, [jobs, search, jobType, location]);

  return (
    <Layout>
      <section className="container py-12 space-y-8">
        <AnimatedSection>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-cool">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Jobs & <span className="text-gradient">Internships</span>
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Discover opportunities from top companies. Filter by type and location to find your perfect match.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <JobFilters
            search={search}
            onSearchChange={setSearch}
            activeType={jobType}
            onTypeChange={setJobType}
            activeLocation={location}
            onLocationChange={setLocation}
            locations={locations}
          />
        </AnimatedSection>

        {loading ? (
          <SkeletonGrid count={6} component={SkeletonJobCard} />
        ) : filtered.length === 0 ? (
          <AnimatedSection>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="font-display text-xl font-semibold">No jobs found</h3>
              <p className="text-muted-foreground mt-1">Check back soon for new opportunities!</p>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedStagger staggerDelay={0.08} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job) => (
              <AnimatedStaggerItem key={job.id}>
                <JobCard job={job} />
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        )}
      </section>
    </Layout>
  );
};

export default Jobs;
