import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { AlertsModal } from "@/components/modals/AlertsModal";
import {
  Activity,
  Bed,
  Calendar,
  Clock,
  Heart,
  User,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Bell
} from "lucide-react";

export function Dashboard() {
  const { getAnalytics, beds, alerts: alertsData, markAllAlertsAsRead } = useHospitalData();
  const analytics = getAnalytics();
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  const stats = [
    {
      title: "Total Patients",
      value: analytics.totalPatients.toString(),
      change: "+12%",
      icon: User,
      color: "text-blue-600"
    },
    {
      title: "Bed Occupancy",
      value: `${Math.round(analytics.occupancyRate)}%`,
      change: "+5%",
      icon: Bed,
      color: "text-green-600"
    },
    {
      title: "Today's Appointments",
      value: analytics.todayAppointments.toString(),
      change: "+8%",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "Active Staff",
      value: analytics.activeStaff.toString(),
      change: "+2%",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  // Calculate dynamic bed status from actual data
  const wardNames = ["ICU", "General Ward A", "General Ward B", "Emergency", "Pediatrics"];
  const bedStatus = wardNames.map(ward => {
    const wardBeds = beds.filter(bed => bed.ward === ward);
    const total = wardBeds.length;
    const occupied = wardBeds.filter(bed => bed.status === 'occupied').length;
    const available = wardBeds.filter(bed => bed.status === 'available').length;
    const maintenance = wardBeds.filter(bed => bed.status === 'maintenance').length;
    const cleaning = wardBeds.filter(bed => bed.status === 'cleaning').length;
    
    return { ward, total, occupied, available, maintenance, cleaning };
  }).filter(ward => ward.total > 0); // Only show wards with beds

  const recentActivities = [
    { id: 1, action: "Patient admitted", patient: "John Doe", time: "10 min ago", type: "admission" },
    { id: 2, action: "Lab results ready", patient: "Jane Smith", time: "15 min ago", type: "lab" },
    { id: 3, action: "Patient discharged", patient: "Mike Johnson", time: "20 min ago", type: "discharge" },
    { id: 4, action: "Emergency admission", patient: "Sarah Wilson", time: "25 min ago", type: "emergency" },
    { id: 5, action: "Surgery scheduled", patient: "Robert Brown", time: "30 min ago", type: "surgery" }
  ];

  const alerts = [
    { id: 1, message: "ICU bed shortage - 90% occupied", type: "warning", priority: "high" },
    { id: 2, message: "Lab equipment maintenance due", type: "info", priority: "medium" },
    { id: 3, message: "Staff schedule conflict in Ward B", type: "warning", priority: "medium" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Hospital Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time overview of hospital operations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Last updated: Just now
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setIsAlertsModalOpen(true)}
          >
            <Bell className="w-4 h-4 mr-2" />
            View All Alerts ({alertsData.filter(a => !a.isRead).length})
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-medical transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bed Status Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-green-600" />
              Bed Management Overview
            </CardTitle>
            <CardDescription>
              Real-time bed availability across all wards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bedStatus.map((ward, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{ward.ward}</span>
                  <span className="text-sm text-muted-foreground">
                    {ward.occupied}/{ward.total} occupied
                  </span>
                </div>
                <div className="flex gap-2 text-xs">
                  <Progress 
                    value={(ward.occupied / ward.total) * 100} 
                    className="flex-1"
                  />
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-status-occupied/10 text-status-occupied">
                      {ward.occupied} Occupied
                    </Badge>
                    <Badge variant="outline" className="bg-status-available/10 text-status-available">
                      {ward.available} Available
                    </Badge>
                    {ward.maintenance > 0 && (
                      <Badge variant="outline" className="bg-status-maintenance/10 text-status-maintenance">
                        {ward.maintenance} Maintenance
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Button 
              variant="medical" 
              className="w-full mt-4"
              onClick={() => window.location.href = '/beds'}
            >
              <Bed className="w-4 h-4 mr-2" />
              View Detailed Bed Management
            </Button>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Active Alerts
            </CardTitle>
            <CardDescription>
              Urgent notifications requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'warning' ? 'bg-warning' : 'bg-primary'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {alert.priority} priority
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest hospital operations and patient updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'admission' ? 'bg-primary/10 text-primary' :
                  activity.type === 'discharge' ? 'bg-success/10 text-success' :
                  activity.type === 'emergency' ? 'bg-destructive/10 text-destructive' :
                  activity.type === 'lab' ? 'bg-accent/50 text-accent-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {activity.type === 'admission' && <User className="w-4 h-4" />}
                  {activity.type === 'discharge' && <CheckCircle className="w-4 h-4" />}
                  {activity.type === 'emergency' && <Heart className="w-4 h-4" />}
                  {activity.type === 'lab' && <Activity className="w-4 h-4" />}
                  {activity.type === 'surgery' && <Calendar className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">Patient: {activity.patient}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertsModal 
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
      />
    </div>
  );
}