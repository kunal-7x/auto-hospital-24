import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { VitalsModal } from "@/components/modals/VitalsModal";
import { VitalsChartModal } from "@/components/modals/VitalsChartModal";
import { useHospitalData, Patient } from "@/contexts/HospitalDataContext";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Calendar,
  MapPin,
  Heart,
  Activity,
  FileText,
  Phone,
  Mail,
  AlertTriangle,
  MoreHorizontal,
  TrendingUp,
  UserMinus,
  Edit,
  Trash2
} from "lucide-react";

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const { dischargePatient, deletePatient } = useHospitalData();
  const { toast } = useToast();
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [isVitalsChartOpen, setIsVitalsChartOpen] = useState(false);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Fair':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Stable':
        return 'bg-success/10 text-success border-success/20';
      case 'Good':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getVitalStatus = (vital: string, value: number) => {
    if (vital === 'heartRate') {
      return value > 100 || value < 60 ? 'text-warning' : 'text-success';
    }
    if (vital === 'temperature') {
      return value > 37.5 || value < 36 ? 'text-warning' : 'text-success';
    }
    if (vital === 'oxygenSat') {
      return value < 95 ? 'text-destructive' : 'text-success';
    }
    return 'text-foreground';
  };

  const handleDischarge = () => {
    dischargePatient(patient.id);
    toast({
      title: "Patient discharged",
      description: `${patient.name} has been successfully discharged`
    });
  };

  const handleDelete = () => {
    deletePatient(patient.id);
    toast({
      title: "Patient record deleted",
      description: `${patient.name}'s record has been removed`
    });
  };

  return (
    <Card className="hover:shadow-medical transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{patient.name}</CardTitle>
              <CardDescription className="flex items-center gap-4 mt-1">
                <span>{patient.age}y • {patient.gender}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {patient.bedNumber}
                </span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getConditionColor(patient.condition)}>
              {patient.condition === 'Critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {patient.condition}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Patient Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsVitalsModalOpen(true)}>
                  <Activity className="w-4 h-4 mr-2" />
                  Update Vitals
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsVitalsChartOpen(true)}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Vitals Chart
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Patient
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDischarge}>
                  <UserMinus className="w-4 h-4 mr-2" />
                  Discharge
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Record
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Patient Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">ID:</span>
            <span className="ml-2 font-medium">{patient.id}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Doctor:</span>
            <span className="ml-2 font-medium">{patient.doctor}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">Diagnosis:</span>
            <span className="ml-2 font-medium">{patient.diagnosis}</span>
          </div>
        </div>

        {/* Allergies */}
        {patient.allergies && patient.allergies.length > 0 && (
          <div>
            <span className="text-sm text-muted-foreground">Allergies:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {patient.allergies.map((allergy, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-destructive/10 text-destructive">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Vitals */}
        <div className="border rounded-lg p-3 bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Latest Vitals</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Heart Rate:</span>
              <span className={getVitalStatus('heartRate', patient.vitals.heartRate)}>
                {patient.vitals.heartRate} bpm
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">BP:</span>
              <span>{patient.vitals.bloodPressure}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Temp:</span>
              <span className={getVitalStatus('temperature', patient.vitals.temperature)}>
                {patient.vitals.temperature}°C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">O2 Sat:</span>
              <span className={getVitalStatus('oxygenSat', patient.vitals.oxygenSat)}>
                {patient.vitals.oxygenSat}%
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3" />
            <span>{patient.contactInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3" />
            <span>{patient.contactInfo.email}</span>
          </div>
        </div>

        {/* Admission Info */}
        <div className="text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Admitted: {patient.admissionDate}</span>
          </div>
          <div className="mt-1">
            <span>Last updated: {patient.lastUpdated}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => setIsVitalsChartOpen(true)}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Vitals Chart
          </Button>
          <Button 
            size="sm" 
            variant="medical" 
            className="flex-1"
            onClick={() => setIsVitalsModalOpen(true)}
          >
            <Activity className="w-4 h-4 mr-1" />
            Update Vitals
          </Button>
        </div>
      </CardContent>

      <VitalsModal 
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        patient={patient}
      />

      <VitalsChartModal 
        isOpen={isVitalsChartOpen}
        onClose={() => setIsVitalsChartOpen(false)}
        patient={patient}
      />
    </Card>
  );
}