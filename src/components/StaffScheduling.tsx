import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Clock, UserCheck, UserX, Plus, RotateCcw } from "lucide-react";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { AddShiftModal } from "@/components/modals/AddShiftModal";
import { AutoScheduleModal } from "@/components/modals/AutoScheduleModal";
import { TimeOffRequestsModal } from "@/components/modals/TimeOffRequestsModal";
import { useToast } from "@/hooks/use-toast";

const mockStaff = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    role: "Doctor",
    department: "Emergency",
    shift: "Day (7AM-7PM)",
    status: "on-duty",
    schedule: ["Mon", "Tue", "Wed"]
  },
  {
    id: 2,
    name: "Nurse Jane Brown",
    role: "Nurse",
    department: "ICU",
    shift: "Night (7PM-7AM)",
    status: "off-duty",
    schedule: ["Thu", "Fri", "Sat"]
  },
  {
    id: 3,
    name: "Dr. Mike Johnson",
    role: "Doctor",
    department: "Cardiology",
    shift: "Day (7AM-7PM)",
    status: "on-leave",
    schedule: ["Mon", "Wed", "Fri"]
  }
];

const mockSchedule = [
  {
    date: "2024-01-15",
    day: "Monday",
    shifts: [
      { time: "7AM-7PM", staff: ["Dr. Wilson", "Nurse Smith", "Dr. Martinez"], department: "Emergency" },
      { time: "7PM-7AM", staff: ["Dr. Brown", "Nurse Johnson"], department: "ICU" }
    ]
  },
  {
    date: "2024-01-16",
    day: "Tuesday",
    shifts: [
      { time: "7AM-7PM", staff: ["Dr. Davis", "Nurse Wilson", "Dr. Taylor"], department: "Surgery" },
      { time: "7PM-7AM", staff: ["Dr. Lee", "Nurse Brown"], department: "Emergency" }
    ]
  }
];

const mockRequests = [
  {
    id: 1,
    staff: "Nurse Jane Brown",
    type: "Time Off",
    dates: "Jan 20-22, 2024",
    reason: "Family vacation",
    status: "pending"
  },
  {
    id: 2,
    staff: "Dr. Mike Johnson",
    type: "Shift Swap",
    details: "Swap Friday shift with Dr. Wilson",
    status: "approved"
  }
];

export function StaffScheduling() {
  const { staff } = useHospitalData();
  const { toast } = useToast();
  const [addShiftModalOpen, setAddShiftModalOpen] = useState(false);
  const [autoScheduleModalOpen, setAutoScheduleModalOpen] = useState(false);
  const [timeOffModalOpen, setTimeOffModalOpen] = useState(false);

  // Mock data
  const [schedule] = useState(mockSchedule);
  const [requests] = useState(mockRequests);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-duty": return "default";
      case "off-duty": return "secondary";
      case "on-leave": return "warning";
      case "approved": return "default";
      case "pending": return "warning";
      case "denied": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Staff Scheduling</h1>
          <p className="text-muted-foreground">Manage staff schedules, shifts, and time-off requests</p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="gap-2" 
            variant="default"
            onClick={() => setAddShiftModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Shift
          </Button>
          <Button 
            className="gap-2" 
            variant="medical"
            onClick={() => setAutoScheduleModalOpen(true)}
          >
            <RotateCcw className="w-4 h-4" />
            Auto Schedule
          </Button>
          <Button 
            className="gap-2" 
            variant="outline"
            onClick={() => setTimeOffModalOpen(true)}
          >
            <Calendar className="w-4 h-4" />
            Time-off Requests
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">48</p>
                <p className="text-sm text-muted-foreground">Total Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">32</p>
                <p className="text-sm text-muted-foreground">On Duty Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <UserX className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList>
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="staff">Staff Directory</TabsTrigger>
          <TabsTrigger value="requests">Time-off Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {schedule.map((day) => (
                  <div key={day.date} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">{day.day} - {day.date}</h3>
                      <Button size="sm" variant="outline">Edit Day</Button>
                    </div>
                    <div className="space-y-3">
                      {day.shifts.map((shift, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded">
                          <div>
                            <p className="font-medium">{shift.time}</p>
                            <p className="text-sm text-muted-foreground">{shift.department}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {shift.staff.map((member, staffIndex) => (
                              <Badge key={staffIndex} variant="outline">
                                {member}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staff.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.role} • {member.department}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Current Shift: {member.shift}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {mockStaff.find(m => m.name === member.name)?.schedule?.map((day, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {day}
                            </Badge>
                          )) || (
                            <Badge variant="outline" className="text-xs">
                              {member.shift}
                            </Badge>
                          )}
                        </div>
                        <Badge variant={getStatusColor(member.status) as any}>
                          {member.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Schedule</Button>
                        <Button size="sm" variant="medical">Edit Shifts</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time-off & Shift Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <Calendar className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">{request.staff}</p>
                        <p className="text-sm text-muted-foreground">{request.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.dates || request.details}
                        </p>
                        {request.reason && (
                          <p className="text-xs text-muted-foreground">
                            Reason: {request.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(request.status) as any}>
                        {request.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="success">Approve</Button>
                        <Button size="sm" variant="destructive">Deny</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staffing Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Department Coverage</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 border rounded">
                      <span>Emergency</span>
                      <span className="font-medium text-success">100%</span>
                    </div>
                    <div className="flex justify-between p-3 border rounded">
                      <span>ICU</span>
                      <span className="font-medium text-warning">85%</span>
                    </div>
                    <div className="flex justify-between p-3 border rounded">
                      <span>Surgery</span>
                      <span className="font-medium text-success">95%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Overtime Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 border rounded">
                      <span>This Week</span>
                      <span className="font-medium">42 hours</span>
                    </div>
                    <div className="flex justify-between p-3 border rounded">
                      <span>Last Week</span>
                      <span className="font-medium">38 hours</span>
                    </div>
                    <div className="flex justify-between p-3 border rounded">
                      <span>Monthly Average</span>
                      <span className="font-medium">156 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddShiftModal isOpen={addShiftModalOpen} onClose={() => setAddShiftModalOpen(false)} />
      <AutoScheduleModal isOpen={autoScheduleModalOpen} onClose={() => setAutoScheduleModalOpen(false)} />
      <TimeOffRequestsModal isOpen={timeOffModalOpen} onClose={() => setTimeOffModalOpen(false)} />
    </div>
  );
}