import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { toast } from "sonner";
import { Activity, ExternalLink } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import RadiologyChat from "./components/RadiologyChat";
import { useSiteSettings } from "./hooks/useSiteData";

const queryClient = new QueryClient();

const MeetingToast = () => {
  const { settings, loading } = useSiteSettings();
  useEffect(() => {
    if (loading) return;
    const url = settings.floating_widget_url?.trim();
    const text = settings.floating_widget_text?.trim() || "Abdomen CT | AOT";
    if (!url) return;
    const timer = setTimeout(() => {
      toast(
        <div
          className="flex items-center gap-3 cursor-pointer w-full"
          onClick={() => {
            window.open(url, "_blank", "noopener,noreferrer");
          }}
        >
          <Activity className="w-5 h-5 flex-shrink-0 text-cyan-400 animate-pulse" />
          <span className="text-cyan-50 font-medium">{text}</span>
          <ExternalLink className="w-4 h-4 flex-shrink-0 text-cyan-300 mr-auto" />
        </div>,
        {
          duration: 8000,
          className: "xray-toast",
        }
      );
    }, 3000);
    return () => clearTimeout(timer);
  }, [loading, settings.floating_widget_url, settings.floating_widget_text]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MeetingToast />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <RadiologyChat />
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
