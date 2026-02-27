import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { toast } from "sonner";
import { Download } from "lucide-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import RadiologyChat from "./components/RadiologyChat";

const queryClient = new QueryClient();

const ChestToast = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      toast(
        <div
          className="flex items-center gap-3 cursor-pointer w-full"
          onClick={() => {
            const a = document.createElement("a");
            a.href = "/chestAOT.pdf";
            a.download = "chestAOT.pdf";
            a.click();
          }}
        >
          <Download className="w-5 h-5 flex-shrink-0" />
          <span>ملف chest xray اضغط للتحميل</span>
        </div>,
        { duration: 8000 }
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
