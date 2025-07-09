
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Patient } from "@/contexts/HospitalDataContext";

interface VitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export function VitalsModal({ isOpen, onClose, patient }: VitalsModalProps) {
  const { toast } = useToast();
  const [vitals, setVitals] = useState({
    temperature: patient?.vitals?.temperature || "98.6",
    bloodPressure: patient?.vitals?.bloodPressure || "120/80",
    heartRate: patient?.vitals?.heartRate || "72",
    oxygenSat: patient?.vitals?.oxygenSat || "98"
  });

  const handleSave = () => {
    if (!patient) return;
    
    toast({
      title: "Vitals Updated",
      description: `Updated vitals for ${patient.name}`
    });
    onClose();
  };

  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Vitals - {patient.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="temperature">Temperature (°F)</Label>
            <Input
              id="temperature"
              value={vitals.temperature}
              onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="bloodPressure">Blood Pressure</Label>
            <Input
              id="bloodPressure"
              value={vitals.bloodPressure}
              onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
            <Input
              id="heartRate"
              value={vitals.heartRate}
              onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="oxygenSat">Oxygen Saturation (%)</Label>
            <Input
              id="oxygenSat"
              value={vitals.oxygenSat}
              onChange={(e) => setVitals({ ...vitals, oxygenSat: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">Save Changes</Button>
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
