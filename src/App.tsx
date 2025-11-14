import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import RequireAuth from "./components/auth/RequireAuth";
import MainLayout from "./components/layout/MainLayout";
import Applications from "./pages/Applications";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Resumes from "./pages/Resumes";
import Signup from "./pages/Signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/applications"
              element={
                <RequireAuth>
                  <MainLayout>
                    <Applications />
                  </MainLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/calendar"
              element={
                <RequireAuth>
                  <MainLayout>
                    <Calendar />
                  </MainLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/resumes"
              element={
                <RequireAuth>
                  <MainLayout>
                    <Resumes />
                  </MainLayout>
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
