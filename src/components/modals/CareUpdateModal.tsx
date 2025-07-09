import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/contexts/HospitalDataContext";
import { useToast } from "@/hooks/use-toast";

interface CareUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export function CareUpdateModal({ isOpen, onClose, patient }: CareUpdateModalProps) {
  const { toast } = useToast();
  const [careNote, setCareNote] = useState("");
  const [careType, setCareType] = useState("");
  const [priority, setPriority] = useState("routine");

  if (!patient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!careNote.trim() || !careType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically update the patient care record
    toast({
      title: "Care Update Added",
      description: `Care note added for ${patient.name}`,
    });

    setCareNote("");
    setCareType("");
    setPriority("routine");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Care - {patient.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Patient Information</Label>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Room {patient.bedNumber} • {patient.diagnosis}
                  </p>
                </div>
                <Badge variant={patient.condition === 'Critical' ? 'destructive' : 
                              patient.condition === 'Stable' ? 'secondary' : 'default'}>
                  {patient.condition}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="careType">Care Type *</Label>
              <Select value={careType} onValueChange={setCareType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select care type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="medication">Medication Administration</SelectItem>
                  <SelectItem value="wound-care">Wound Care</SelectItem>
                  <SelectItem value="vitals">Vitals Check</SelectItem>
                  <SelectItem value="mobility">Mobility Assistance</SelectItem>
                  <SelectItem value="education">Patient Education</SelectItem>
                  <SelectItem value="discharge-prep">Discharge Preparation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="careNote">Care Notes *</Label>
            <Textarea
              id="careNote"
              placeholder="Document care provided, patient response, and any observations..."
              value={careNote}
              onChange={(e) => setCareNote(e.target.value)}
              rows={6}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Care Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}