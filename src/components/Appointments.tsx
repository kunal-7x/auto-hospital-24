import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Phone, Plus, Search, Filter } from "lucide-react";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { AppointmentFormModal } from "@/components/modals/AppointmentFormModal";
import { ContactModal } from "@/components/modals/ContactModal";
import { RescheduleModal } from "@/components/modals/RescheduleModal";

export function Appointments() {
  const { appointments, getAnalytics } = useHospitalData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  
  const analytics = getAnalytics();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "success";
      case "pending": return "warning";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments & Scheduling</h1>
          <p className="text-muted-foreground">Manage patient appointments and schedules</p>
        </div>
        <Button 
          className="gap-2" 
          variant="default"
          onClick={() => setIsAppointmentModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          New Appointment
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{analytics.todayAppointments}</p>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Phone className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Calls Needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients or doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="font-semibold">{appointment.time}</p>
                        <p className="text-sm text-muted-foreground">{appointment.date}</p>
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                        <p className="text-xs text-muted-foreground">{appointment.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(appointment.status) as any}>
                        {appointment.status}
                      </Badge>
                      <Badge variant="outline">{appointment.type}</Badge>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setIsRescheduleModalOpen(true);
                          }}
                        >
                          Reschedule
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setIsContactModalOpen(true);
                          }}
                        >
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-center mb-2">{day}</h3>
                    <div className="space-y-2">
                      <div className="text-xs p-2 bg-primary/10 rounded">
                        <p className="font-medium">09:00 - John S.</p>
                        <p className="text-muted-foreground">Dr. Wilson</p>
                      </div>
                      <div className="text-xs p-2 bg-success/10 rounded">
                        <p className="font-medium">14:00 - Sarah J.</p>
                        <p className="text-muted-foreground">Dr. Brown</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-background p-8 rounded-lg text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium">Interactive Calendar</p>
                <p className="text-muted-foreground">Full calendar view with drag-and-drop scheduling</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AppointmentFormModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        mode="create"
      />

      {selectedAppointment && (
        <>
          <ContactModal
            isOpen={isContactModalOpen}
            onClose={() => {
              setIsContactModalOpen(false);
              setSelectedAppointment(null);
            }}
            patientName={selectedAppointment.patientName}
            patientPhone={selectedAppointment.phone}
          />

          <RescheduleModal
            isOpen={isRescheduleModalOpen}
            onClose={() => {
              setIsRescheduleModalOpen(false);
              setSelectedAppointment(null);
            }}
            appointmentId={selectedAppointment.id}
            currentDate={selectedAppointment.date}
            currentTime={selectedAppointment.time}
            patientName={selectedAppointment.patientName}
            doctor={selectedAppointment.doctor}
          />
        </>
      )}
    </div>
  );
}