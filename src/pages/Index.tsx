import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { BedManagement } from "@/components/BedManagement";
import { PatientManagement } from "@/components/PatientManagement";
import { Appointments } from "@/components/Appointments";
import { Admissions } from "@/components/Admissions";
import { Orders } from "@/components/Orders";
import { NursingStation } from "@/components/NursingStation";
import { Medications } from "@/components/Medications";
import { Billing } from "@/components/Billing";
import { StaffScheduling } from "@/components/StaffScheduling";
import { Button } from "@/components/ui/button";
import { User, ChevronDown, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [userRole, setUserRole] = useState("Doctor");

  const renderMainContent = () => {
    switch (currentView) {
      case "beds":
        return <BedManagement />;
      case "patients":
        return <PatientManagement />;
      case "appointments":
        return <Appointments />;
      case "admissions":
        return <Admissions />;
      case "orders":
        return <Orders />;
      case "nursing":
        return <NursingStation />;
      case "medications":
        return <Medications />;
      case "billing":
        return <Billing />;
      case "staff":
        return <StaffScheduling />;
      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex w-full">
      <Sidebar userRole={userRole} />
      
      <main className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="h-16 bg-card border-b border-border shadow-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-foreground capitalize">
              {currentView === "dashboard" ? "Dashboard" : currentView.replace(/([A-Z])/g, ' $1')}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Role Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  {userRole}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setUserRole("Doctor")}>
                  Doctor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole("Nurse")}>
                  Nurse
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole("Administrator")}>
                  Administrator
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole("Receptionist")}>
                  Receptionist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole("Lab Technician")}>
                  Lab Technician
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
            </Button>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button 
                variant={currentView === "dashboard" ? "default" : "outline"} 
                size="sm"
                onClick={() => setCurrentView("dashboard")}
              >
                Dashboard
              </Button>
              <Button 
                variant={currentView === "patients" ? "medical" : "outline"} 
                size="sm"
                onClick={() => setCurrentView("patients")}
              >
                Patients
              </Button>
              <Button 
                variant={currentView === "beds" ? "medical" : "outline"} 
                size="sm"
                onClick={() => setCurrentView("beds")}
              >
                Beds
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
