import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MessageSquare,
  Mail,
  Smartphone,
  Settings,
  Search,
  Filter
} from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    type: "critical",
    title: "Patient in Room 204 - Critical Vitals",
    message: "Blood pressure reading 180/120, immediate attention required",
    timestamp: "2 minutes ago",
    isRead: false,
    category: "medical"
  },
  {
    id: 2,
    type: "warning",
    title: "Medication Due - Patient John Smith",
    message: "Morning medication due for Patient #12345",
    timestamp: "15 minutes ago",
    isRead: false,
    category: "medication"
  },
  {
    id: 3,
    type: "info",
    title: "Lab Results Available",
    message: "Blood work results ready for Patient #12346",
    timestamp: "1 hour ago",
    isRead: true,
    category: "lab"
  },
  {
    id: 4,
    type: "appointment",
    title: "Upcoming Appointment",
    message: "Dr. Wilson - Patient consultation at 3:00 PM",
    timestamp: "2 hours ago",
    isRead: false,
    category: "appointment"
  },
  {
    id: 5,
    type: "system",
    title: "System Maintenance Scheduled",
    message: "Scheduled maintenance tonight from 11 PM - 2 AM",
    timestamp: "4 hours ago",
    isRead: true,
    category: "system"
  }
];

const notificationSettings = [
  { id: "critical", name: "Critical Alerts", description: "Life-threatening situations", enabled: true },
  { id: "medication", name: "Medication Reminders", description: "Drug administration alerts", enabled: true },
  { id: "lab", name: "Lab Results", description: "Test results and reports", enabled: true },
  { id: "appointment", name: "Appointments", description: "Scheduling notifications", enabled: false },
  { id: "system", name: "System Updates", description: "Maintenance and updates", enabled: false }
];

export function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [settings, setSettings] = useState(notificationSettings);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "warning": return <Clock className="w-4 h-4 text-warning" />;
      case "info": return <CheckCircle className="w-4 h-4 text-primary" />;
      case "appointment": return <Bell className="w-4 h-4 text-accent" />;
      case "system": return <Settings className="w-4 h-4 text-muted-foreground" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "critical": return "destructive";
      case "warning": return "warning";
      case "info": return "default";
      case "appointment": return "secondary";
      case "system": return "outline";
      default: return "secondary";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || notif.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const updateSetting = (id: string, enabled: boolean) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled } : setting
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            Manage alerts and communication preferences
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Mark All Read
          </Button>
          <Button className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Pending Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Types</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="appointment">Appointments</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Notifications List */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex items-start gap-4 p-4 border-b last:border-b-0 hover:bg-accent transition-colors ${
                      !notification.isRead ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant={getTypeBadge(notification.type) as any}>
                            {notification.type}
                          </Badge>
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{setting.name}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={(enabled) => updateSetting(setting.id, enabled)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Bell className="w-8 h-8 mx-auto text-primary mb-3" />
                    <h3 className="font-medium mb-2">In-App Notifications</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Real-time alerts within the application
                    </p>
                    <Switch defaultChecked />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Mail className="w-8 h-8 mx-auto text-primary mb-3" />
                    <h3 className="font-medium mb-2">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Important updates sent to your email
                    </p>
                    <Switch defaultChecked />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Smartphone className="w-8 h-8 mx-auto text-primary mb-3" />
                    <h3 className="font-medium mb-2">SMS Alerts</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Critical alerts sent to your mobile
                    </p>
                    <Switch />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}