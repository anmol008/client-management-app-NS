import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { AuthLayout } from "@/components/AuthLayout";
import SigninPage from "@/pages/SigninPage";
import SignupPage from "@/pages/SignupPage";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardContent } from "@/components/DashboardContent";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark">
        <div className="min-h-screen w-full">
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/signin" element={<SigninPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                </Route>

                {/* Protected routes with persistent layout */}
                <Route element={<AuthLayout protected withHeader />}>
                  <Route path="/dashboard" element={<MainLayout><DashboardContent /></MainLayout>} />
                </Route>

                {/* Redirect route */}
                <Route path="/" element={<Index />} />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
