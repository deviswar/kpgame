import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";
import WelcomePage from "./pages/WelcomePage";
import FeedPage from "./pages/FeedPage";
import CowFightPage from "./pages/CowFightPage";
import MilkHospitalPage from "./pages/MilkHospitalPage";
import AirplanePage from "./pages/AirplanePage";
import AboutPage from "./pages/AboutPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main game - sequential flow */}
          <Route path="/" element={<Index />} />
          
          {/* Admin panel - direct access to all screens */}
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Individual screens for direct navigation */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/cow-fight" element={<CowFightPage />} />
          <Route path="/milk-hospital" element={<MilkHospitalPage />} />
          <Route path="/airplane" element={<AirplanePage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
