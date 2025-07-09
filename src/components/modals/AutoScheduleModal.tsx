import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw, Calendar, Users, Clock } from "lucide-react";

interface AutoScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AutoScheduleModal({ isOpen, onClose }: AutoScheduleModalProps) {
  const { staff } = useHospitalData();
  const { toast } = useToast();
  const [scheduleForm, setScheduleForm] = useState({
    startDate: "",
    endDate: "",
    department: "",
    shiftPattern: "standard",
    considerPreferences: true,
    considerExperience: true,
    maxHoursPerWeek: "40",
    minRestHours: "12"
  });

  const [generatedSchedule, setGeneratedSchedule] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!scheduleForm.startDate || !scheduleForm.endDate) {
      toast({
        title: "Error",
        description: "Please select start and end dates",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate schedule generation
    setTimeout(() => {
      const mockSchedule = [
        {
          date: "2024-01-15",
          shifts: [
            {
              time: "7AM-7PM",
              department: scheduleForm.department || "Emergency",
              staff: ["Dr. Wilson", "Nurse Smith", "Tech Johnson"],
              coverage: "100%"
            },
            {
              time: "7PM-7AM",
              department: scheduleForm.department || "Emergency", 
              staff: ["Dr. Brown", "Nurse Davis"],
              coverage: "85%"
            }
          ]
        },
        {
          date: "2024-01-16", 
          shifts: [
            {
              time: "7AM-7PM",
              department: scheduleForm.department || "Emergency",
              staff: ["Dr. Martinez", "Nurse Wilson", "Tech Brown"],
              coverage: "95%"
            },
            {
              time: "7PM-7AM",
              department: scheduleForm.department || "Emergency",
              staff: ["Dr. Taylor", "Nurse Lee"],
              coverage: "90%"
            }
          ]
        }
      ];
      
      setGeneratedSchedule(mockSchedule);
      setIsGenerating(false);
      
      toast({
        title: "Schedule Generated",
        description: `Auto-schedule created for ${scheduleForm.department || 'selected'} department`,
      });
    }, 2000);
  };

  const handleApprove = () => {
    toast({
      title: "Schedule Approved",
      description: "Auto-generated schedule has been applied and staff notifications sent",
    });
    
    setGeneratedSchedule([]);
    setScheduleForm({
      startDate: "",
      endDate: "",
      department: "",
      shiftPattern: "standard",
      considerPreferences: true,
      considerExperience: true,
      maxHoursPerWeek: "40",
      minRestHours: "12"
    });
    
    onClose();
  };

  const getCoverageColor = (coverage: string) => {
    const percent = parseInt(coverage);
    if (percent >= 95) return "default";
    if (percent >= 85) return "warning";
    return "destructive";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="auto-schedule-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Auto Schedule Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Configuration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={scheduleForm.startDate}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={scheduleForm.endDate}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={scheduleForm.department} onValueChange={(value) => setScheduleForm(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="Surgery">Surgery</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shiftPattern">Shift Pattern</Label>
                  <Select value={scheduleForm.shiftPattern} onValueChange={(value) => setScheduleForm(prev => ({ ...prev, shiftPattern: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (12-hour shifts)</SelectItem>
                      <SelectItem value="rotating">Rotating (8-hour shifts)</SelectItem>
                      <SelectItem value="flexible">Flexible (Mixed shifts)</SelectItem>
                      <SelectItem value="weekend">Weekend Coverage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxHours">Max Hours per Week</Label>
                  <Input
                    id="maxHours"
                    type="number"
                    placeholder="40"
                    value={scheduleForm.maxHoursPerWeek}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, maxHoursPerWeek: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="minRest">Min Rest Hours</Label>
                  <Input
                    id="minRest"
                    type="number"
                    placeholder="12"
                    value={scheduleForm.minRestHours}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, minRestHours: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="preferences"
                    checked={scheduleForm.considerPreferences}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, considerPreferences: e.target.checked }))}
                  />
                  <Label htmlFor="preferences">Consider Staff Preferences</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="experience"
                    checked={scheduleForm.considerExperience}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, considerExperience: e.target.checked }))}
                  />
                  <Label htmlFor="experience">Balance Experience Levels</Label>
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Generating Schedule...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Generate Auto Schedule
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Schedule Preview */}
          {generatedSchedule.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Schedule Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedSchedule.map((day, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{day.date}</h4>
                        <Badge variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          {day.shifts.length} shifts
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {day.shifts.map((shift: any, shiftIndex: number) => (
                          <div key={shiftIndex} className="flex items-center justify-between p-3 bg-muted rounded">
                            <div>
                              <p className="font-medium">{shift.time}</p>
                              <p className="text-sm text-muted-foreground">{shift.department}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex flex-wrap gap-1">
                                {shift.staff.map((member: string, memberIndex: number) => (
                                  <Badge key={memberIndex} variant="outline" className="text-xs">
                                    {member}
                                  </Badge>
                                ))}
                              </div>
                              <Badge variant={getCoverageColor(shift.coverage) as any}>
                                {shift.coverage}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setGeneratedSchedule([])}>
                    Regenerate
                  </Button>
                  <Button onClick={handleApprove} className="flex-1">
                    <Users className="w-4 h-4 mr-2" />
                    Approve & Apply Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}