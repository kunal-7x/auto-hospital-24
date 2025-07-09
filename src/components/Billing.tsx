import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, CreditCard, FileText, AlertCircle, TrendingUp, Search, Download, Eye, Receipt } from "lucide-react";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { PaymentProcessingModal } from "@/components/modals/PaymentProcessingModal";
import { InsuranceClaimsModal } from "@/components/modals/InsuranceClaimsModal";
import { useToast } from "@/hooks/use-toast";

const mockBills = [
  {
    id: 1,
    patient: "John Smith",
    amount: 2450.00,
    date: "2024-01-15",
    status: "paid",
    insurance: "Blue Cross",
    services: ["Surgery", "Lab Tests", "Medications"]
  },
  {
    id: 2,
    patient: "Sarah Johnson",
    amount: 1280.00,
    date: "2024-01-14",
    status: "pending",
    insurance: "Aetna",
    services: ["Consultation", "X-Ray", "Prescription"]
  },
  {
    id: 3,
    patient: "Mike Davis",
    amount: 890.00,
    date: "2024-01-13",
    status: "overdue",
    insurance: "Medicare",
    services: ["Emergency Visit", "CT Scan"]
  }
];

const mockClaims = [
  {
    id: 1,
    patient: "Emily Brown",
    claimNumber: "CLM-2024-0015",
    amount: 3200.00,
    submittedDate: "2024-01-10",
    status: "approved",
    insurance: "United Healthcare",
    approvedAmount: 2880.00
  },
  {
    id: 2,
    patient: "Robert Wilson",
    claimNumber: "CLM-2024-0016",
    amount: 1500.00,
    submittedDate: "2024-01-12",
    status: "pending",
    insurance: "Cigna",
    approvedAmount: null
  }
];

export function Billing() {
  const [bills] = useState(mockBills); // Use mock data for now
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [claimsModalOpen, setClaimsModalOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState<string | undefined>();

  // Mock claims data
  const [claims] = useState([
    {
      id: 1,
      patient: "Emily Brown",
      claimNumber: "CLM-2024-0015",
      amount: 3200.00,
      submittedDate: "2024-01-10",
      status: "approved",
      insurance: "United Healthcare",
      approvedAmount: 2880.00
    },
    {
      id: 2,
      patient: "Robert Wilson",
      claimNumber: "CLM-2024-0016",
      amount: 1500.00,
      submittedDate: "2024-01-12",
      status: "pending",
      insurance: "Cigna",
      approvedAmount: null
    }
  ]);

  const handleProcessPayment = (billId?: string) => {
    setSelectedBillId(billId);
    setPaymentModalOpen(true);
  };

  const handleViewInvoice = (bill: any) => {
    toast({
      title: "Invoice Generated",
      description: `Invoice for ${bill.patient} has been generated and sent`,
    });
  };

  const handleViewClaim = (claim: any) => {
    toast({
      title: "Claim Details",
      description: `Viewing details for claim ${claim.claimNumber}`,
    });
  };

  const handleFollowUp = (claim: any) => {
    toast({
      title: "Follow-up Initiated",
      description: `Follow-up request sent for claim ${claim.claimNumber}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": case "approved": return "default";
      case "pending": return "warning";
      case "overdue": case "denied": return "destructive";
      default: return "secondary";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing & Insurance</h1>
          <p className="text-muted-foreground">Manage patient billing and insurance claims</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="default">
            <FileText className="w-4 h-4" />
            Generate Invoice
          </Button>
          <Button 
            className="gap-2" 
            variant="medical"
            onClick={() => handleProcessPayment()}
          >
            <CreditCard className="w-4 h-4" />
            Process Payment
          </Button>
          <Button 
            className="gap-2" 
            variant="outline"
            onClick={() => setClaimsModalOpen(true)}
          >
            <FileText className="w-4 h-4" />
            Manage Claims
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">$24,680</p>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">$18,920</p>
                <p className="text-sm text-muted-foreground">Outstanding Receivables</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-sm text-muted-foreground">Pending Claims</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">94.2%</p>
                <p className="text-sm text-muted-foreground">Collection Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bills" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bills">Patient Bills</TabsTrigger>
          <TabsTrigger value="claims">Insurance Claims</TabsTrigger>
          <TabsTrigger value="payments">Payment Processing</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients, bills, or claim numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        <TabsContent value="bills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <DollarSign className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">{bill.patient}</p>
                        <p className="text-sm text-muted-foreground">{bill.insurance}</p>
                        <p className="text-xs text-muted-foreground">
                          Services: {bill.services.join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(bill.amount)}</p>
                        <p className="text-sm text-muted-foreground">{bill.date}</p>
                      </div>
                      <Badge variant={getStatusColor(bill.status) as any}>
                        {bill.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewInvoice(bill)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Invoice
                        </Button>
                        <Button 
                          size="sm" 
                          variant="medical"
                          onClick={() => handleProcessPayment(bill.id?.toString())}
                        >
                          <Receipt className="w-4 h-4 mr-1" />
                          Process Payment
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claims.map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <FileText className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">{claim.patient}</p>
                        <p className="text-sm text-muted-foreground">{claim.claimNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {claim.insurance} • Submitted: {claim.submittedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(claim.amount)}</p>
                        {claim.approvedAmount && (
                          <p className="text-sm text-success">
                            Approved: {formatCurrency(claim.approvedAmount)}
                          </p>
                        )}
                      </div>
                      <Badge variant={getStatusColor(claim.status) as any}>
                        {claim.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewClaim(claim)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Claim
                        </Button>
                        <Button 
                          size="sm" 
                          variant="medical"
                          onClick={() => handleFollowUp(claim)}
                        >
                          Follow Up
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Quick Payment Entry</h3>
                  <div className="space-y-3">
                    <Input placeholder="Patient Name" />
                    <Input placeholder="Payment Amount" type="number" />
                    <Input placeholder="Payment Method" />
                    <Button className="w-full">Process Payment</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Payment Methods</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 border rounded">
                      <span>Cash Payments</span>
                      <span className="font-medium">$8,450</span>
                    </div>
                    <div className="flex justify-between p-3 border rounded">
                      <span>Credit Card</span>
                      <span className="font-medium">$12,230</span>
                    </div>
                    <div className="flex justify-between p-3 border rounded">
                      <span>Insurance</span>
                      <span className="font-medium">$18,920</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Daily Revenue Report</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Daily billing and collection summary
                  </p>
                  <Button size="sm" variant="outline">Generate Report</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Outstanding Receivables</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Aging report for unpaid bills
                  </p>
                  <Button size="sm" variant="outline">Generate Report</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Insurance Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Claims status and payer performance
                  </p>
                  <Button size="sm" variant="outline">Generate Report</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Payment Trends</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Payment method analysis and trends
                  </p>
                  <Button size="sm" variant="outline">Generate Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <PaymentProcessingModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        billId={selectedBillId}
      />

      <InsuranceClaimsModal
        isOpen={claimsModalOpen}
        onClose={() => setClaimsModalOpen(false)}
      />
    </div>
  );
}