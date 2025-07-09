import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Thermometer, Activity, Clock, CheckSquare, Users, AlertCircle, Eye, Edit } from "lucide-react";
import { useHospitalData, Patient } from "@/contexts/HospitalDataContext";
import { PatientChartModal } from "@/components/modals/PatientChartModal";
import { CareUpdateModal } from "@/components/modals/CareUpdateModal";
import { VitalsModal } from "@/components/modals/VitalsModal";
import { TaskManagementModal } from "@/components/modals/TaskManagementModal";
import { EmergencyAlertModal } from "@/components/modals/EmergencyAlertModal";
import { HandoverReportModal } from "@/components/modals/HandoverReportModal";
import { useToast } from "@/hooks/use-toast";

export function NursingStation() {
  const { patients } = useHospitalData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [careModalOpen, setCareModalOpen] = useState(false);
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [handoverModalOpen, setHandoverModalOpen] = useState(false);

  const activePatients = patients.filter(p => p.status === 'active');
  
  const mockShift = {
    nurse: "Nurse Johnson",
    shift: "Day Shift (7AM - 7PM)",
    patients: activePatients.length,
    criticalTasks: activePatients.filter(p => p.condition === 'Critical').length,
    completedTasks: 12
  };

  const handleViewChart = (patient: Patient) => {
    setSelectedPatient(patient);
    setChartModalOpen(true);
  };

  const handleUpdateCare = (patient: Patient) => {
    setSelectedPatient(patient);
    setCareModalOpen(true);
  };

  const handleUpdateVitals = (patient: Patient) => {
    setSelectedPatient(patient);
    setVitalsModalOpen(true);
  };

  const handleTaskManagement = () => {
    setTaskModalOpen(true);
  };

  const handleShiftHandover = () => {
    setHandoverModalOpen(true);
  };

  const handleEmergencyAlert = () => {
    setEmergencyModalOpen(true);
  };

  const getPriorityColor = (condition: string) => {
    switch (condition) {
      case "Critical": return "destructive";
      case "Fair": return "warning";
      case "Stable": return "secondary";
      case "Good": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nursing Station</h1>
          <p className="text-muted-foreground">Patient care management and shift coordination</p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="gap-2" 
            variant="medical"
            onClick={handleEmergencyAlert}
          >
            <Heart className="w-4 h-4" />
            Emergency Alert
          </Button>
          <Button 
            className="gap-2" 
            variant="outline"
            onClick={handleShiftHandover}
          >
            <Users className="w-4 h-4" />
            Shift Handover
          </Button>
        </div>
      </div>

      {/* Shift Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockShift.patients}</p>
                <p className="text-sm text-muted-foreground">Assigned Patients</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{mockShift.criticalTasks}</p>
                <p className="text-sm text-muted-foreground">Critical Tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckSquare className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{mockShift.completedTasks}</p>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-accent" />
              <div>
                <p className="text-lg font-bold">{mockShift.shift}</p>
                <p className="text-sm text-muted-foreground">{mockShift.nurse}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Patient Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vitals Monitoring</TabsTrigger>
          <TabsTrigger value="tasks">Task Management</TabsTrigger>
          <TabsTrigger value="handover">Shift Handover</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {activePatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-medical transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <Badge variant={getPriorityColor(patient.condition) as any}>
                      {patient.condition}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Room {patient.bedNumber} • {patient.diagnosis}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Vitals */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-4 h-4 text-destructive" />
                        <span>{patient.vitals.temperature}°F</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4 text-primary" />
                        <span>{patient.vitals.bloodPressure}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-success" />
                        <span>{patient.vitals.heartRate} BPM</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4 text-accent" />
                        <span>{patient.vitals.oxygenSat}%</span>
                      </div>
                    </div>

                    {/* Care Status */}
                    <div>
                      <p className="text-sm font-medium mb-2">Care Status:</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckSquare className="w-3 h-3 text-muted-foreground" />
                          <span>Regular monitoring</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckSquare className="w-3 h-3 text-muted-foreground" />
                          <span>Medication schedule</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleViewChart(patient)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Chart
                      </Button>
                      <Button 
                        size="sm" 
                        variant="medical" 
                        className="flex-1"
                        onClick={() => handleUpdateCare(patient)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Update Care
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vitals Monitoring Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {activePatients.map((patient) => (
                  <div key={patient.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">Room {patient.bedNumber}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Temperature:</span>
                        <span className="font-medium">{patient.vitals.temperature}°F</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Blood Pressure:</span>
                        <span className="font-medium">{patient.vitals.bloodPressure}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Heart Rate:</span>
                        <span className="font-medium">{patient.vitals.heartRate} BPM</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>SpO2:</span>
                        <span className="font-medium">{patient.vitals.oxygenSat}%</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3" 
                      variant="outline"
                      onClick={() => handleUpdateVitals(patient)}
                    >
                      Update Vitals
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Task Management</CardTitle>
                <Button onClick={handleTaskManagement} size="sm">
                  Manage All Tasks
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-destructive bg-destructive/5 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-destructive">Urgent: Medication Due</p>
                      <p className="text-sm text-muted-foreground">Patient requiring immediate attention</p>
                    </div>
                    <Button size="sm" variant="destructive">Complete</Button>
                  </div>
                </div>
                <div className="p-4 border-l-4 border-warning bg-warning/5 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-warning">High: Wound Dressing</p>
                      <p className="text-sm text-muted-foreground">Scheduled care routine</p>
                    </div>
                    <Button size="sm" variant="warning">Complete</Button>
                  </div>
                </div>
                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-primary">Routine: Discharge Preparation</p>
                      <p className="text-sm text-muted-foreground">Non-urgent task</p>
                    </div>
                    <Button size="sm" variant="outline">Complete</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="handover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shift Handover Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Critical Updates</h3>
                  <div className="space-y-2 text-sm">
                    <p>• Sarah Johnson (A-102): Fever spike at 2 PM, medication adjusted</p>
                    <p>• John Smith (A-101): Post-surgery recovery progressing well</p>
                    <p>• New admission expected at 8 PM - Room A-105</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Pending Tasks for Next Shift</h3>
                  <div className="space-y-2 text-sm">
                    <p>• Room A-102: Respiratory therapy at 8 PM</p>
                    <p>• Room A-103: Discharge paperwork completion</p>
                    <p>• Room A-101: Midnight vitals check</p>
                  </div>
                </div>
                <Button className="w-full" onClick={handleShiftHandover}>Generate Handover Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <PatientChartModal
        isOpen={chartModalOpen}
        onClose={() => setChartModalOpen(false)}
        patient={selectedPatient}
      />

      <CareUpdateModal
        isOpen={careModalOpen}
        onClose={() => setCareModalOpen(false)}
        patient={selectedPatient}
      />

      <VitalsModal
        isOpen={vitalsModalOpen}
        onClose={() => setVitalsModalOpen(false)}
        patient={selectedPatient}
      />

      <TaskManagementModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
      />

      <EmergencyAlertModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      <HandoverReportModal
        isOpen={handoverModalOpen}
        onClose={() => setHandoverModalOpen(false)}
      />
    </div>
  );
}