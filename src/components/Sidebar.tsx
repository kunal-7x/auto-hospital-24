import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Activity,
  Bed,
  Calendar,
  Clock,
  FileText,
  Heart,
  Home,
  Pill,
  Settings,
  Shield,
  TrendingUp,
  User,
  Users,
  Wallet,
  Bell,
  LogOut,
  Menu,
  X
} from "lucide-react";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home, color: "text-primary" },
  { title: "Patient Management", url: "/patients", icon: User, color: "text-blue-600" },
  { title: "Bed Management", url: "/beds", icon: Bed, color: "text-green-600" },
  { title: "Appointments", url: "/appointments", icon: Calendar, color: "text-purple-600" },
  { title: "Admissions", url: "/admissions", icon: Clock, color: "text-orange-600" },
  { title: "Orders & Results", url: "/orders", icon: FileText, color: "text-indigo-600" },
  { title: "Nursing Station", url: "/nursing", icon: Heart, color: "text-red-600" },
  { title: "Medications", url: "/medications", icon: Pill, color: "text-teal-600" },
  { title: "Billing & Insurance", url: "/billing", icon: Wallet, color: "text-yellow-600" },
  { title: "Staff Scheduling", url: "/staff", icon: Users, color: "text-pink-600" },
  { title: "Analytics", url: "/analytics", icon: TrendingUp, color: "text-emerald-600" },
  { title: "Compliance", url: "/compliance", icon: Shield, color: "text-gray-600" },
  { title: "Notifications", url: "/notifications", icon: Bell, color: "text-amber-600" },
];

interface SidebarProps {
  userRole?: string;
}

export function Sidebar({ userRole = "Doctor" }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-card border-r border-border shadow-card transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                  MedFlow AI
                </h1>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-accent"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-medical"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    isActive ? "text-primary" : item.color
                  )}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.title}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={() => {
            // Handle logout
            console.log("Logout clicked");
          }}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}