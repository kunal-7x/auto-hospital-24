import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Heart, Shield } from "lucide-react";

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyAlertModal({ isOpen, onClose }: EmergencyAlertModalProps) {
  const { toast } = useToast();
  const [alertType, setAlertType] = useState("medical");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Emergency Alert Sent!",
      description: "All relevant staff have been notified immediately.",
      variant: "destructive"
    });
    
    onClose();
    setDescription("");
    setAlertType("medical");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Emergency Alert
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="alertType">Emergency Type</Label>
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medical">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Medical Emergency
                  </div>
                </SelectItem>
                <SelectItem value="security">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security Alert
                  </div>
                </SelectItem>
                <SelectItem value="fire">Fire Emergency</SelectItem>
                <SelectItem value="evacuation">Evacuation Required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the emergency situation..."
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" variant="destructive" className="flex-1">
              Send Alert
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}