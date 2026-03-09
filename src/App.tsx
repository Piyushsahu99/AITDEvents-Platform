import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import Jobs from "./pages/Jobs";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminGames from "./pages/admin/AdminGames";
import AdminUsers from "./pages/admin/AdminUsers";
import Auth from "./pages/Auth";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Learning from "./pages/Learning";
import GamesPage from "./pages/Games";
import Mentorship from "./pages/Mentorship";
import About from "./pages/About";
import {
  Scholarships, Bounties, Contact,
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/games" element={<AdminGames />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/bounties" element={<Bounties />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/ambassador" element={<Ambassador />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
