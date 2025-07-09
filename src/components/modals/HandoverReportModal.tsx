import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { FileText, Download, Users } from "lucide-react";

interface HandoverReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HandoverReportModal({ isOpen, onClose }: HandoverReportModalProps) {
  const { toast } = useToast();
  const { patients, orders } = useHospitalData();
  const [additionalNotes, setAdditionalNotes] = useState("");

  const activePatients = patients.filter(p => p.status === 'active');
  const criticalPatients = activePatients.filter(p => p.condition === 'Critical');
  const pendingOrders = orders.filter(o => o.status === 'pending');

  const handleGenerate = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      totalPatients: activePatients.length,
      criticalPatients: criticalPatients.length,
      pendingOrders: pendingOrders.length,
      notes: additionalNotes
    };

    // Simulate file download
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `handover-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Handover Report Generated",
      description: "Report has been downloaded successfully"
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate Shift Handover Report
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{activePatients.length}</p>
              <p className="text-sm text-muted-foreground">Total Patients</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-destructive" />
              <p className="text-2xl font-bold">{criticalPatients.length}</p>
              <p className="text-sm text-muted-foreground">Critical Patients</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-warning" />
              <p className="text-2xl font-bold">{pendingOrders.length}</p>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
            </div>
          </div>

          {/* Critical Updates */}
          <div>
            <h3 className="font-medium mb-2">Critical Updates</h3>
            <div className="space-y-2 text-sm bg-muted p-3 rounded-lg">
              {criticalPatients.length > 0 ? (
                criticalPatients.map(patient => (
                  <p key={patient.id}>
                    • {patient.name} ({patient.bedNumber}): {patient.diagnosis} - Critical condition
                  </p>
                ))
              ) : (
                <p>• No critical patients at this time</p>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes for Next Shift</Label>
            <Textarea
              id="notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Add any important notes for the incoming shift..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleGenerate} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Generate & Download Report
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}