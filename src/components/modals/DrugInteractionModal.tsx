import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Shield, CheckCircle, Search } from "lucide-react";

interface DrugInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  clinicalEffect: string;
  recommendation: string;
  patientId?: string;
  patientName?: string;
}

export function DrugInteractionModal({ isOpen, onClose }: DrugInteractionModalProps) {
  const { toast } = useToast();
  const [searchDrug1, setSearchDrug1] = useState("");
  const [searchDrug2, setSearchDrug2] = useState("");
  const [checkResult, setCheckResult] = useState<DrugInteraction[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const mockInteractions: DrugInteraction[] = [
    {
      id: '1',
      drug1: 'Warfarin',
      drug2: 'Aspirin',
      severity: 'major',
      description: 'Concurrent use increases bleeding risk',
      clinicalEffect: 'Increased anticoagulant effect, potential for serious bleeding',
      recommendation: 'Monitor INR closely. Consider alternative antiplatelet therapy.',
      patientId: 'P001',
      patientName: 'John Doe'
    },
    {
      id: '2',
      drug1: 'Metformin',
      drug2: 'Contrast dye',
      severity: 'moderate',
      description: 'Risk of lactic acidosis in patients with kidney dysfunction',
      clinicalEffect: 'Increased risk of contrast-induced nephropathy',
      recommendation: 'Hold metformin 48 hours before and after contrast administration',
      patientId: 'P002',
      patientName: 'Jane Smith'
    },
    {
      id: '3',
      drug1: 'Simvastatin',
      drug2: 'Clarithromycin',
      severity: 'contraindicated',
      description: 'Significantly increases statin levels',
      clinicalEffect: 'Severe risk of rhabdomyolysis and myopathy',
      recommendation: 'Do not use together. Consider alternative antibiotic or statin.',
    },
    {
      id: '4',
      drug1: 'Lisinopril',
      drug2: 'Potassium supplements',
      severity: 'moderate',
      description: 'Risk of hyperkalemia',
      clinicalEffect: 'Elevated serum potassium levels',
      recommendation: 'Monitor serum potassium levels regularly',
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'secondary';
      case 'moderate': return 'warning';
      case 'major': return 'destructive';
      case 'contraindicated': return 'destructive';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'minor': return <CheckCircle className="w-4 h-4" />;
      case 'moderate': return <Shield className="w-4 h-4" />;
      case 'major': return <AlertTriangle className="w-4 h-4" />;
      case 'contraindicated': return <AlertTriangle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const handleDrugCheck = () => {
    if (!searchDrug1.trim() || !searchDrug2.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both medications to check for interactions",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);
    
    // Simulate API call
    setTimeout(() => {
      const interactions = mockInteractions.filter(interaction => 
        (interaction.drug1.toLowerCase().includes(searchDrug1.toLowerCase()) && 
         interaction.drug2.toLowerCase().includes(searchDrug2.toLowerCase())) ||
        (interaction.drug1.toLowerCase().includes(searchDrug2.toLowerCase()) && 
         interaction.drug2.toLowerCase().includes(searchDrug1.toLowerCase()))
      );
      
      setCheckResult(interactions);
      setIsChecking(false);
      
      if (interactions.length === 0) {
        toast({
          title: "No Interactions Found",
          description: `No known interactions between ${searchDrug1} and ${searchDrug2}`,
        });
      }
    }, 1500);
  };

  const currentPatientInteractions = mockInteractions.filter(interaction => interaction.patientId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Drug Interaction Checker
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Drug Interaction Checker */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Check Drug Interactions</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="drug1">First Medication</Label>
                  <Input
                    id="drug1"
                    placeholder="Enter medication name..."
                    value={searchDrug1}
                    onChange={(e) => setSearchDrug1(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="drug2">Second Medication</Label>
                  <Input
                    id="drug2"
                    placeholder="Enter medication name..."
                    value={searchDrug2}
                    onChange={(e) => setSearchDrug2(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleDrugCheck} 
                disabled={isChecking}
                className="w-full"
              >
                {isChecking ? (
                  "Checking Interactions..."
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Check Interactions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Check Results */}
          {checkResult.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Interaction Results</h3>
                <div className="space-y-3">
                  {checkResult.map((interaction) => (
                    <div key={interaction.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{interaction.drug1} + {interaction.drug2}</p>
                          <p className="text-sm text-muted-foreground">{interaction.description}</p>
                        </div>
                        <Badge variant={getSeverityColor(interaction.severity) as any} className="flex items-center gap-1">
                          {getSeverityIcon(interaction.severity)}
                          {interaction.severity}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Clinical Effect: </span>
                          <span>{interaction.clinicalEffect}</span>
                        </div>
                        <div>
                          <span className="font-medium">Recommendation: </span>
                          <span className="text-primary">{interaction.recommendation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Patient Interactions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Active Patient Interactions</h3>
              <div className="space-y-3">
                {currentPatientInteractions.map((interaction) => (
                  <div key={interaction.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{interaction.drug1} + {interaction.drug2}</p>
                        <p className="text-sm text-muted-foreground">
                          Patient: {interaction.patientName} ({interaction.patientId})
                        </p>
                      </div>
                      <Badge variant={getSeverityColor(interaction.severity) as any} className="flex items-center gap-1">
                        {getSeverityIcon(interaction.severity)}
                        {interaction.severity}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Clinical Effect: </span>
                        <span>{interaction.clinicalEffect}</span>
                      </div>
                      <div>
                        <span className="font-medium">Recommendation: </span>
                        <span className="text-primary">{interaction.recommendation}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">Acknowledge</Button>
                      <Button size="sm" variant="destructive">Override</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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