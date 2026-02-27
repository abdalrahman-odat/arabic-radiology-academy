import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { toast } from "sonner";
import { Download, Activity } from "lucide-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import RadiologyChat from "./components/RadiologyChat";

const queryClient = new QueryClient();

const ChestToast = () => {
  useEffect(() => {
    // Pre-fetch the PDF as a blob so download is instant on click
    let cachedUrl: string | null = null;
    fetch("/chestAOT.pdf")
      .then((res) => res.blob())
      .then((blob) => {
        cachedUrl = URL.createObjectURL(blob);
      })
      .catch(() => {});

    const timer = setTimeout(() => {
      toast(
        <div
          className="flex items-center gap-3 cursor-pointer w-full"
          onClick={async () => {
            let url = cachedUrl;
            if (!url) {
              const res = await fetch("/chestAOT.pdf");
              const blob = await res.blob();
              url = URL.createObjectURL(blob);
            }
            const a = document.createElement("a");
            a.href = url;
            a.download = "chestAOT.pdf";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // Don't revoke cached URL immediately on iOS — slight delay helps
            setTimeout(() => URL.revokeObjectURL(url!), 3000);
          }}
        >
          <Activity className="w-5 h-5 flex-shrink-0 text-cyan-400 animate-pulse" />
          <span className="text-cyan-50 font-medium">ملف chest xray اضغط للتحميل</span>
          <Download className="w-4 h-4 flex-shrink-0 text-cyan-300 mr-auto" />
        </div>,
        {
          duration: 8000,
          className: "xray-toast",
        }
      );
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ChestToast />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <RadiologyChat />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
