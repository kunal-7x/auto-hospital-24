import { useState } from "react";
import { PatientCard } from "@/components/PatientCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { PatientFormModal } from "@/components/modals/PatientFormModal";
import { QuickActionsModal } from "@/components/modals/QuickActionsModal";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Plus,
  Users,
  UserPlus,
  Calendar,
  Download
} from "lucide-react";

export function PatientManagement() {
  const { patients } = useHospitalData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondition, setFilterCondition] = useState("all");
  const [filterWard, setFilterWard] = useState("all");
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'admit' | 'surgery' | 'report' | 'round' | null>(null);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition = filterCondition === "all" || patient.condition === filterCondition;
    const matchesWard = filterWard === "all" || patient.bedNumber.includes(filterWard);
    
    return matchesSearch && matchesCondition && matchesWard;
  });

  const conditionCounts = {
    total: patients.length,
    critical: patients.filter(p => p.condition === 'Critical').length,
    fair: patients.filter(p => p.condition === 'Fair').length,
    stable: patients.filter(p => p.condition === 'Stable').length,
    good: patients.filter(p => p.condition === 'Good').length
  };

  const handleExportReport = () => {
    const csvContent = patients.map(p => 
      `${p.name},${p.id},${p.condition},${p.diagnosis},${p.doctor},${p.bedNumber}`
    ).join('\n');
    
    const blob = new Blob([`Name,ID,Condition,Diagnosis,Doctor,Bed\n${csvContent}`], 
      { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patients_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast({
      title: "Report exported",
      description: "Patient report has been downloaded as CSV"
    });
  };

  const handleQuickAction = (action: 'admit' | 'surgery' | 'report' | 'round') => {
    setSelectedAction(action);
    setIsQuickActionsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Patient Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive patient care and monitoring system
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button 
            variant="medical" 
            size="sm"
            onClick={() => setIsAdmitModalOpen(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Admit Patient
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-medical transition-all duration-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{conditionCounts.total}</div>
              <div className="text-sm text-muted-foreground">Total Patients</div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-medical transition-all duration-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{conditionCounts.critical}</div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-medical transition-all duration-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{conditionCounts.fair}</div>
              <div className="text-sm text-muted-foreground">Fair</div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-medical transition-all duration-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{conditionCounts.stable}</div>
              <div className="text-sm text-muted-foreground">Stable</div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-medical transition-all duration-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{conditionCounts.good}</div>
              <div className="text-sm text-muted-foreground">Good</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, ID, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCondition} onValueChange={setFilterCondition}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Stable">Stable</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterWard} onValueChange={setFilterWard}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                <SelectItem value="ICU">ICU</SelectItem>
                <SelectItem value="GA">General Ward</SelectItem>
                <SelectItem value="MAT">Maternity</SelectItem>
                <SelectItem value="ER">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No patients found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common patient management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => handleQuickAction('admit')}
            >
              <UserPlus className="w-6 h-6" />
              <span>Admit New Patient</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => handleQuickAction('surgery')}
            >
              <Calendar className="w-6 h-6" />
              <span>Schedule Surgery</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => handleQuickAction('report')}
            >
              <Download className="w-6 h-6" />
              <span>Generate Reports</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => handleQuickAction('round')}
            >
              <Users className="w-6 h-6" />
              <span>Ward Round</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <PatientFormModal 
        isOpen={isAdmitModalOpen}
        onClose={() => setIsAdmitModalOpen(false)}
        mode="create"
      />

      <QuickActionsModal 
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        action={selectedAction}
      />
    </div>
  );
}