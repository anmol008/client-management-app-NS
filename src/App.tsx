import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Clients from "./pages/Clients";
import Products from "./pages/Products";
import Subscriptions from "./pages/Subscriptions";
import Licenses from "./pages/Licenses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              isAuthenticated ? (
                <DashboardLayout onLogout={handleLogout}>
                  <Dashboard />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/clients" element={
              isAuthenticated ? (
                <DashboardLayout onLogout={handleLogout}>
                  <Clients />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/products" element={
              isAuthenticated ? (
                <DashboardLayout onLogout={handleLogout}>
                  <Products />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/subscriptions" element={
              isAuthenticated ? (
                <DashboardLayout onLogout={handleLogout}>
                  <Subscriptions />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/licenses" element={
              isAuthenticated ? (
                <DashboardLayout onLogout={handleLogout}>
                  <Licenses />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
