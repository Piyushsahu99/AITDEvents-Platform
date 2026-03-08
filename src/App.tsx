import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import {
  Jobs, Learning, Games, Blog, Mentorship,
  Scholarships, Bounties, About, Contact, Auth,
  Leaderboard, Ambassador,
} from "./pages/Placeholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/games" element={<Games />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/bounties" element={<Bounties />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/ambassador" element={<Ambassador />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
