import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useHospitalData, Medication } from "@/contexts/HospitalDataContext";
import { useToast } from "@/hooks/use-toast";
import { Pill, Clock, User, AlertTriangle } from "lucide-react";

interface MedicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  medication: Medication | null;
}

export function MedicationDetailsModal({ isOpen, onClose, medication }: MedicationDetailsModalProps) {
  const { toast } = useToast();
  const [administrationNote, setAdministrationNote] = useState("");

  if (!medication) return null;

  const handleAdminister = () => {
    // In a real app, this would update the medication record
    toast({
      title: "Medication Administered",
      description: `${medication.medication} administered to ${medication.patientName}`,
    });
    setAdministrationNote("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Medication Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Patient Info */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{medication.patientName}</p>
                <p className="text-sm text-muted-foreground">Patient ID: {medication.patientId}</p>
              </div>
              <Badge variant={medication.status === 'active' ? 'default' : 'secondary'}>
                {medication.status}
              </Badge>
            </div>
          </div>

          {/* Medication Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Medication</Label>
                <p className="font-medium">{medication.medication}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Dosage</Label>
                <p>{medication.dosage}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Frequency</Label>
                <p>{medication.frequency}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Prescribing Doctor</Label>
                <p>{medication.doctor}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                <p>{medication.startDate}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
                <p>{medication.endDate || 'Ongoing'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Administration Log */}
          <div>
            <h3 className="font-medium mb-3">Administration History</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {medication.administrationLog.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{log.administeredBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Quick Administration */}
          <div>
            <h3 className="font-medium mb-3">Administer Medication</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="adminNote">Administration Notes</Label>
                <Textarea
                  id="adminNote"
                  placeholder="Any observations or notes about administration..."
                  value={administrationNote}
                  onChange={(e) => setAdministrationNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button type="button" onClick={handleAdminister}>
            Administer Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}