import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { Moon, Sun } from "lucide-react";
import React from "react";
import { AppSidebar } from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto relative">
          {/* Theme Toggle - Top Right */}
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
            </Button>
          </div>
          <div className="container py-6 max-w-7xl">{children}</div>
        </main>
      </div>
      <Toaster />
      <Sonner />
    </SidebarProvider>
  );
};

export default MainLayout;
