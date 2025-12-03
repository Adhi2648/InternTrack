import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Calendar,
  FileText,
  FileUp,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

// Menu items
const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Applications",
    url: "/applications",
    icon: FileText,
  },
  {
    title: "Internships",
    url: "/internships",
    icon: Briefcase,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Resume Tracker",
    url: "/resumes",
    icon: FileUp,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="px-4 py-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">
                IT
              </span>
            </div>
            <span className="font-semibold text-lg">InternTrack</span>
          </div>
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3",
                            isActive &&
                              "bg-sidebar-accent text-sidebar-accent-foreground"
                          )
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="border-t p-4 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start cursor-default"
            disabled
          >
            <User className="h-4 w-4 mr-2" />
            <span className="truncate">{auth.user?.username || "User"}</span>
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </Sidebar>
      {/* Floating hamburger trigger when the sidebar is collapsed on desktop */}
      {!isMobile && state === "collapsed" && (
        <div className="fixed left-4 top-6 z-50 md:block hidden">
          <SidebarTrigger className="h-10 w-10 rounded-full shadow-lg" />
        </div>
      )}
    </>
  );
}
