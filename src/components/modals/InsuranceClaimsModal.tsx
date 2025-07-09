import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Download, CheckCircle } from "lucide-react";

interface InsuranceClaimsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Claim {
  id: string;
  patientId: string;
  patientName: string;
  claimNumber: string;
  insuranceProvider: string;
  amount: number;
  status: 'draft' | 'submitted' | 'pending' | 'approved' | 'denied';
  submittedDate?: string;
  approvedAmount?: number;
  denialReason?: string;
  services: string[];
}

export function InsuranceClaimsModal({ isOpen, onClose }: InsuranceClaimsModalProps) {
  const { patients } = useHospitalData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'new' | 'followup'>('overview');
  
  const [claims] = useState<Claim[]>([
    {
      id: '1',
      patientId: 'P001',
      patientName: 'John Doe',
      claimNumber: 'CLM-2024-0015',
      insuranceProvider: 'Blue Cross Blue Shield',
      amount: 2450.00,
      status: 'approved',
      submittedDate: '2024-01-10',
      approvedAmount: 2200.00,
      services: ['Surgery', 'Anesthesia', 'Recovery Room']
    },
    {
      id: '2',
      patientId: 'P002',
      patientName: 'Jane Smith',
      claimNumber: 'CLM-2024-0016',
      insuranceProvider: 'Aetna',
      amount: 1280.00,
      status: 'pending',
      submittedDate: '2024-01-12',
      services: ['Consultation', 'X-Ray', 'Lab Tests']
    },
    {
      id: '3',
      patientId: 'P001',
      patientName: 'John Doe',
      claimNumber: 'CLM-2024-0017',
      insuranceProvider: 'Medicare',
      amount: 890.00,
      status: 'denied',
      submittedDate: '2024-01-08',
      denialReason: 'Pre-authorization required',
      services: ['CT Scan', 'Radiologist Review']
    }
  ]);

  const [newClaim, setNewClaim] = useState({
    patientId: '',
    insuranceProvider: '',
    amount: '',
    services: '',
    diagnosis: '',
    notes: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'warning';
      case 'denied': return 'destructive';
      case 'submitted': return 'secondary';
      case 'draft': return 'outline';
      default: return 'secondary';
    }
  };

  const handleNewClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClaim.patientId || !newClaim.amount || !newClaim.insuranceProvider) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const patient = patients.find(p => p.id === newClaim.patientId);
    const claimNumber = `CLM-2024-${String(Date.now()).slice(-4)}`;
    
    toast({
      title: "Claim Submitted",
      description: `Insurance claim ${claimNumber} submitted for ${patient?.name}`,
    });

    setNewClaim({
      patientId: '',
      insuranceProvider: '',
      amount: '',
      services: '',
      diagnosis: '',
      notes: ''
    });
    
    setActiveTab('overview');
  };

  const handleFollowUp = (claim: Claim) => {
    toast({
      title: "Follow-up Initiated",
      description: `Follow-up request sent for claim ${claim.claimNumber}`,
    });
  };

  const handleResubmit = (claim: Claim) => {
    toast({
      title: "Claim Resubmitted",
      description: `Claim ${claim.claimNumber} has been resubmitted with corrections`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const pendingClaims = claims.filter(claim => claim.status === 'pending' || claim.status === 'submitted');
  const approvedClaims = claims.filter(claim => claim.status === 'approved');
  const deniedClaims = claims.filter(claim => claim.status === 'denied');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Insurance Claims Management
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            Claims Overview
          </Button>
          <Button 
            variant={activeTab === 'new' ? 'default' : 'outline'}
            onClick={() => setActiveTab('new')}
          >
            New Claim
          </Button>
          <Button 
            variant={activeTab === 'followup' ? 'default' : 'outline'}
            onClick={() => setActiveTab('followup')}
          >
            Follow-up
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{claims.length}</p>
                    <p className="text-sm text-muted-foreground">Total Claims</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">{pendingClaims.length}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">{approvedClaims.length}</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-destructive">{deniedClaims.length}</p>
                    <p className="text-sm text-muted-foreground">Denied</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Claims List */}
            <div className="space-y-3">
              {claims.map((claim) => (
                <Card key={claim.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium">{claim.claimNumber}</p>
                          <p className="text-sm text-muted-foreground">{claim.patientName} • {claim.insuranceProvider}</p>
                          <p className="text-xs text-muted-foreground">
                            Services: {claim.services.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold">{formatCurrency(claim.amount)}</p>
                          {claim.approvedAmount && (
                            <p className="text-sm text-success">
                              Approved: {formatCurrency(claim.approvedAmount)}
                            </p>
                          )}
                          {claim.denialReason && (
                            <p className="text-sm text-destructive">
                              Reason: {claim.denialReason}
                            </p>
                          )}
                        </div>
                        <Badge variant={getStatusColor(claim.status) as any}>
                          {claim.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                          {claim.status === 'pending' && (
                            <Button size="sm" variant="medical" onClick={() => handleFollowUp(claim)}>
                              Follow Up
                            </Button>
                          )}
                          {claim.status === 'denied' && (
                            <Button size="sm" variant="default" onClick={() => handleResubmit(claim)}>
                              Resubmit
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'new' && (
          <form onSubmit={handleNewClaimSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient">Patient *</Label>
                <Select value={newClaim.patientId} onValueChange={(value) => setNewClaim(prev => ({ ...prev, patientId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.filter(p => p.status === 'active').map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.bedNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="insurance">Insurance Provider *</Label>
                <Select value={newClaim.insuranceProvider} onValueChange={(value) => setNewClaim(prev => ({ ...prev, insuranceProvider: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Blue Cross Blue Shield">Blue Cross Blue Shield</SelectItem>
                    <SelectItem value="Aetna">Aetna</SelectItem>
                    <SelectItem value="Cigna">Cigna</SelectItem>
                    <SelectItem value="United Healthcare">United Healthcare</SelectItem>
                    <SelectItem value="Medicare">Medicare</SelectItem>
                    <SelectItem value="Medicaid">Medicaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Claim Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newClaim.amount}
                  onChange={(e) => setNewClaim(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="diagnosis">Primary Diagnosis</Label>
                <Input
                  id="diagnosis"
                  placeholder="ICD-10 code or description"
                  value={newClaim.diagnosis}
                  onChange={(e) => setNewClaim(prev => ({ ...prev, diagnosis: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="services">Services Provided</Label>
              <Textarea
                id="services"
                placeholder="List all services, procedures, and treatments..."
                value={newClaim.services}
                onChange={(e) => setNewClaim(prev => ({ ...prev, services: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information for the claim..."
                value={newClaim.notes}
                onChange={(e) => setNewClaim(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setActiveTab('overview')}>
                Cancel
              </Button>
              <Button type="submit">
                <Upload className="w-4 h-4 mr-2" />
                Submit Claim
              </Button>
            </DialogFooter>
          </form>
        )}

        {activeTab === 'followup' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Follow-ups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingClaims.map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{claim.claimNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {claim.patientName} • Submitted: {claim.submittedDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleFollowUp(claim)}>
                          Send Follow-up
                        </Button>
                        <Button size="sm" variant="medical">
                          Call Provider
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}