import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ClientsProvider } from "@/context/ClientsContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { SubscriptionsProvider } from "@/context/SubscriptionsContext";
import { LicensesProvider } from "@/context/LicensesContext";
import { AuthLayout } from "@/components/AuthLayout";
import SigninPage from "@/pages/SigninPage";
import SignupPage from "@/pages/SignupPage";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardContent } from "@/components/DashboardContent";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Subscriptions from "./pages/Subscriptions";
import Products from "./pages/Products";
import Clients from "./pages/Clients";
import Licenses from "./pages/Licenses";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="light">
        <div className="min-h-screen w-full">
          <BrowserRouter>
            <AuthProvider>
              <ClientsProvider>
                <ProductsProvider>
                  <SubscriptionsProvider>
                    <LicensesProvider>
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

                        <Route element={<AuthLayout protected withHeader />}>
                          <Route path="/subscriptions" element={<MainLayout><Subscriptions /></MainLayout>} />
                        </Route>

                        <Route element={<AuthLayout protected withHeader />}>
                          <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
                        </Route>

                        <Route element={<AuthLayout protected withHeader />}>
                          <Route path="/clients" element={<MainLayout><Clients /></MainLayout>} />
                        </Route>

                        <Route element={<AuthLayout protected withHeader />}>
                          <Route path="/licenses" element={<MainLayout><Licenses /></MainLayout>} />
                        </Route>

                        <Route element={<AuthLayout protected withHeader />}>
                          <Route path="/settings" element={<MainLayout><Licenses /></MainLayout>} />
                        </Route>

                        {/* Redirect route */}
                        <Route path="/" element={<Index />} />

                        {/* Catch-all */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </LicensesProvider>
                  </SubscriptionsProvider>
                </ProductsProvider>
              </ClientsProvider>
            </AuthProvider>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
