import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, UserMinus, Clock, FileText, AlertCircle, CheckCircle } from "lucide-react";

const mockAdmissions = [
  {
    id: 1,
    patient: "Emily Brown",
    room: "A-101",
    admitDate: "2024-01-15",
    admitTime: "08:30",
    condition: "Pneumonia",
    status: "active",
    doctor: "Dr. Wilson",
    insurance: "verified"
  },
  {
    id: 2,
    patient: "Robert Davis",
    room: "B-205",
    admitDate: "2024-01-14",
    admitTime: "15:45",
    condition: "Appendicitis",
    status: "discharge-pending",
    doctor: "Dr. Martinez",
    insurance: "pending"
  }
];

const mockDischarges = [
  {
    id: 1,
    patient: "Lisa Johnson",
    room: "C-301",
    dischargeDate: "2024-01-15",
    dischargeTime: "11:00",
    condition: "Recovery Complete",
    status: "completed",
    doctor: "Dr. Smith",
    followUp: "2024-01-22"
  }
];

export function Admissions() {
  const { toast } = useToast();
  const { patients, dischargePatient } = useHospitalData();
  const [admissions, setAdmissions] = useState(mockAdmissions);
  const [discharges, setDischarges] = useState(mockDischarges);

  const handleDischarge = (patientId: string) => {
    dischargePatient(patientId);
    toast({
      title: "Patient Discharged",
      description: "Patient has been successfully discharged"
    });
  };

  const handleNewAdmission = () => {
    toast({
      title: "New Admission",
      description: "Admission form opened"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "discharge-pending": return "warning";
      case "completed": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admissions & Discharge</h1>
          <p className="text-muted-foreground">Manage patient admissions and discharge processes</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="default">
            <UserPlus className="w-4 h-4" />
            New Admission
          </Button>
          <Button className="gap-2" variant="medical">
            <UserMinus className="w-4 h-4" />
            Discharge Patient
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <UserPlus className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Today's Admissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <UserMinus className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Today's Discharges</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Pending Discharge</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Insurance Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="admissions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="admissions">Active Admissions</TabsTrigger>
          <TabsTrigger value="discharges">Recent Discharges</TabsTrigger>
          <TabsTrigger value="pending">Pending Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="admissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Admissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {admissions.map((admission) => (
                  <div key={admission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="font-semibold">{admission.room}</p>
                        <p className="text-sm text-muted-foreground">Room</p>
                      </div>
                      <div>
                        <p className="font-medium">{admission.patient}</p>
                        <p className="text-sm text-muted-foreground">{admission.doctor}</p>
                        <p className="text-xs text-muted-foreground">
                          Admitted: {admission.admitDate} at {admission.admitTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(admission.status) as any}>
                        {admission.status}
                      </Badge>
                      <Badge variant="outline">{admission.condition}</Badge>
                      {admission.insurance === "verified" ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-warning" />
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" variant="medical">Discharge</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discharges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Discharges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {discharges.map((discharge) => (
                  <div key={discharge.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="font-semibold">{discharge.room}</p>
                        <p className="text-sm text-muted-foreground">Room</p>
                      </div>
                      <div>
                        <p className="font-medium">{discharge.patient}</p>
                        <p className="text-sm text-muted-foreground">{discharge.doctor}</p>
                        <p className="text-xs text-muted-foreground">
                          Discharged: {discharge.dischargeDate} at {discharge.dischargeTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">Discharged</Badge>
                      <Badge variant="outline">{discharge.condition}</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-1" />
                          Summary
                        </Button>
                        <Button size="sm" variant="outline">Follow-up</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-warning bg-warning/5 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Insurance Verification Required</p>
                      <p className="text-sm text-muted-foreground">Robert Davis - Room B-205</p>
                    </div>
                    <Button size="sm" variant="warning">Verify Now</Button>
                  </div>
                </div>
                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Discharge Summary Pending</p>
                      <p className="text-sm text-muted-foreground">Maria Garcia - Room A-205</p>
                    </div>
                    <Button size="sm" variant="default">Complete Summary</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}