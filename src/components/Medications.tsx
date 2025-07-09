import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, Package, AlertTriangle, Clock, Plus, Search, Shield, Eye, Syringe } from "lucide-react";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { MedicationDetailsModal } from "@/components/modals/MedicationDetailsModal";
import { InventoryModal } from "@/components/modals/InventoryModal";
import { DrugInteractionModal } from "@/components/modals/DrugInteractionModal";
import { MedicationFormModal } from "@/components/modals/MedicationFormModal";
import { useToast } from "@/hooks/use-toast";

const mockMedications = [
  {
    id: 1,
    patient: "John Smith",
    medication: "Amoxicillin 500mg",
    dosage: "1 tablet, 3x daily",
    startDate: "2024-01-15",
    endDate: "2024-01-22",
    status: "active",
    prescriber: "Dr. Wilson"
  },
  {
    id: 2,
    patient: "Sarah Johnson",
    medication: "Ibuprofen 400mg",
    dosage: "1 tablet, as needed",
    startDate: "2024-01-14",
    endDate: "2024-01-21",
    status: "due",
    prescriber: "Dr. Brown"
  }
];

const mockInventory = [
  {
    id: 1,
    name: "Amoxicillin 500mg",
    stock: 145,
    minLevel: 50,
    expiry: "2024-12-15",
    location: "Pharmacy A-1",
    status: "adequate"
  },
  {
    id: 2,
    name: "Ibuprofen 400mg",
    stock: 25,
    minLevel: 30,
    expiry: "2024-08-20",
    location: "Pharmacy A-2",
    status: "low"
  },
  {
    id: 3,
    name: "Insulin Glargine",
    stock: 8,
    minLevel: 10,
    expiry: "2024-03-15",
    location: "Pharmacy Cold Storage",
    status: "critical"
  }
];

export function Medications() {
  const { medications, administerMedication } = useHospitalData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [interactionModalOpen, setInteractionModalOpen] = useState(false);
  const [medicationFormOpen, setMedicationFormOpen] = useState(false);

  const handleViewDetails = (medication) => {
    setSelectedMedication(medication);
    setDetailsModalOpen(true);
  };

  const handleAdminister = (medication) => {
    administerMedication(medication.id, "Current User", "Administered as scheduled");
    toast({
      title: "Medication Administered",
      description: `${medication.medication} administered to ${medication.patientName}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "due": return "warning";
      case "overdue": return "destructive";
      case "adequate": return "default";
      case "low": return "warning";
      case "critical": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medications & Pharmacy</h1>
          <p className="text-muted-foreground">Manage prescriptions, inventory, and drug safety</p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="gap-2" 
            variant="default"
            onClick={() => setMedicationFormOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Prescription
          </Button>
          <Button 
            className="gap-2" 
            variant="medical"
            onClick={() => setInventoryModalOpen(true)}
          >
            <Package className="w-4 h-4" />
            Manage Inventory
          </Button>
          <Button 
            className="gap-2" 
            variant="outline"
            onClick={() => setInteractionModalOpen(true)}
          >
            <AlertTriangle className="w-4 h-4" />
            Check Interactions
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Pill className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">48</p>
                <p className="text-sm text-muted-foreground">Active Prescriptions</p>
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
                <p className="text-sm text-muted-foreground">Due for Administration</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Drug Interactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Medications</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="interactions">Drug Interactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search medications, patients, or prescribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <Pill className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">{med.medication}</p>
                        <p className="text-sm text-muted-foreground">{med.patientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {med.dosage} • Prescribed by {med.doctor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{med.startDate} - {med.endDate}</p>
                        <Badge variant={getStatusColor(med.status) as any}>
                          {med.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetails(med)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="medical"
                          onClick={() => handleAdminister(med)}
                        >
                          <Syringe className="w-4 h-4 mr-1" />
                          Administer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medication Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInventory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <Package className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Location: {item.location}</p>
                        <p className="text-xs text-muted-foreground">
                          Expires: {item.expiry}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold">{item.stock}</p>
                        <p className="text-sm text-muted-foreground">Min: {item.minLevel}</p>
                      </div>
                      <Badge variant={getStatusColor(item.status) as any}>
                        {item.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Reorder</Button>
                        <Button size="sm" variant="medical">Update Stock</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Drug Interaction Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-destructive bg-destructive/5 rounded">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-destructive">Critical Interaction Alert</p>
                      <p className="text-sm text-muted-foreground">
                        Patient: John Smith - Warfarin + Aspirin interaction detected
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Increased bleeding risk. Consider alternative therapy.
                      </p>
                    </div>
                    <Button size="sm" variant="destructive">Review</Button>
                  </div>
                </div>
                <div className="p-4 border-l-4 border-warning bg-warning/5 rounded">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-warning mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-warning">Moderate Interaction</p>
                      <p className="text-sm text-muted-foreground">
                        Patient: Sarah Johnson - Metformin + Contrast dye
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Monitor kidney function. Hold metformin before imaging.
                      </p>
                    </div>
                    <Button size="sm" variant="warning">Review</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medication Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Usage Reports</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Medication usage patterns and compliance
                  </p>
                  <Button size="sm" variant="outline">Generate Report</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Inventory Reports</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Stock levels and expiry tracking
                  </p>
                  <Button size="sm" variant="outline">Generate Report</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Safety Reports</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Adverse reactions and interactions
                  </p>
                  <Button size="sm" variant="outline">Generate Report</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Cost Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Medication costs and budget tracking
                  </p>
                  <Button size="sm" variant="outline">Generate Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <MedicationDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        medication={selectedMedication}
      />

      <InventoryModal
        isOpen={inventoryModalOpen}
        onClose={() => setInventoryModalOpen(false)}
      />

      <DrugInteractionModal
        isOpen={interactionModalOpen}
        onClose={() => setInteractionModalOpen(false)}
      />

      {/* Note: MedicationFormModal needs to be implemented with correct props */}
    </div>
  );
}