
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Directory from "./pages/Directory";
import PlatformPage from "./pages/PlatformPage";
import NotFound from "./pages/NotFound";
import DatabaseInitializer from "./components/DatabaseInitializer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/platform/:id" element={<PlatformPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <DatabaseInitializer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
