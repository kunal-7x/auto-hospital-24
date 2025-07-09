import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Plus } from "lucide-react";

interface AddShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddShiftModal({ isOpen, onClose }: AddShiftModalProps) {
  const { staff } = useHospitalData();
  const { toast } = useToast();
  const [shiftForm, setShiftForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    department: "",
    role: "",
    staffIds: [] as string[],
    minStaff: "",
    maxStaff: "",
    notes: ""
  });

  const handleStaffToggle = (staffId: string, checked: boolean) => {
    if (checked) {
      setShiftForm(prev => ({
        ...prev,
        staffIds: [...prev.staffIds, staffId]
      }));
    } else {
      setShiftForm(prev => ({
        ...prev,
        staffIds: prev.staffIds.filter(id => id !== staffId)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shiftForm.date || !shiftForm.startTime || !shiftForm.endTime || !shiftForm.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Shift Created",
      description: `New shift created for ${shiftForm.department} on ${shiftForm.date}`,
    });

    // Reset form
    setShiftForm({
      date: "",
      startTime: "",
      endTime: "",
      department: "",
      role: "",
      staffIds: [],
      minStaff: "",
      maxStaff: "",
      notes: ""
    });
    
    onClose();
  };

  const availableStaff = staff.filter(s => s.status === 'active');
  const filteredStaff = shiftForm.role 
    ? availableStaff.filter(s => s.role.toLowerCase().includes(shiftForm.role.toLowerCase()))
    : availableStaff;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" aria-describedby="add-shift-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Shift
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={shiftForm.date}
                onChange={(e) => setShiftForm(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={shiftForm.startTime}
                onChange={(e) => setShiftForm(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={shiftForm.endTime}
                onChange={(e) => setShiftForm(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department *</Label>
              <Select value={shiftForm.department} onValueChange={(value) => setShiftForm(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="ICU">ICU</SelectItem>
                  <SelectItem value="Surgery">Surgery</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Radiology">Radiology</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="role">Filter by Role</Label>
              <Select value={shiftForm.role} onValueChange={(value) => setShiftForm(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minStaff">Minimum Staff Required</Label>
              <Input
                id="minStaff"
                type="number"
                placeholder="0"
                value={shiftForm.minStaff}
                onChange={(e) => setShiftForm(prev => ({ ...prev, minStaff: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="maxStaff">Maximum Staff</Label>
              <Input
                id="maxStaff"
                type="number"
                placeholder="10"
                value={shiftForm.maxStaff}
                onChange={(e) => setShiftForm(prev => ({ ...prev, maxStaff: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Assign Staff Members</Label>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
              {filteredStaff.map((staffMember) => (
                <div key={staffMember.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`staff-${staffMember.id}`}
                    checked={shiftForm.staffIds.includes(staffMember.id)}
                    onCheckedChange={(checked) => handleStaffToggle(staffMember.id, checked as boolean)}
                  />
                  <Label htmlFor={`staff-${staffMember.id}`} className="text-sm">
                    {staffMember.name} - {staffMember.role} ({staffMember.department})
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Selected: {shiftForm.staffIds.length} staff members
            </p>
          </div>

          <div>
            <Label htmlFor="notes">Shift Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or special instructions for this shift..."
              value={shiftForm.notes}
              onChange={(e) => setShiftForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Calendar className="w-4 h-4 mr-2" />
              Create Shift
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}