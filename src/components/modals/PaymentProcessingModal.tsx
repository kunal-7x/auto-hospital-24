import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, DollarSign, Receipt } from "lucide-react";

interface PaymentProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  billId?: string;
}

export function PaymentProcessingModal({ isOpen, onClose, billId }: PaymentProcessingModalProps) {
  const { patients, bills } = useHospitalData();
  const { toast } = useToast();
  const [paymentForm, setPaymentForm] = useState({
    patientId: "",
    amount: "",
    paymentMethod: "cash",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    insuranceProvider: "",
    claimNumber: "",
    notes: ""
  });

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentForm.patientId || !paymentForm.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const patient = patients.find(p => p.id === paymentForm.patientId);
    
    toast({
      title: "Payment Processed",
      description: `Payment of $${paymentForm.amount} processed for ${patient?.name || 'patient'}`,
    });

    // Reset form
    setPaymentForm({
      patientId: "",
      amount: "",
      paymentMethod: "cash",
      cardNumber: "",
      cardExpiry: "",
      cardCVC: "",
      insuranceProvider: "",
      claimNumber: "",
      notes: ""
    });
    
    onClose();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Processing
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patient">Patient *</Label>
              <Select value={paymentForm.patientId} onValueChange={(value) => setPaymentForm(prev => ({ ...prev, patientId: value }))}>
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
              <Label htmlFor="amount">Payment Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select value={paymentForm.paymentMethod} onValueChange={(value) => setPaymentForm(prev => ({ ...prev, paymentMethod: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="debit-card">Debit Card</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="payment-plan">Payment Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(paymentForm.paymentMethod === 'credit-card' || paymentForm.paymentMethod === 'debit-card') && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h4 className="font-medium">Card Details</h4>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentForm.cardNumber}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                    <Input
                      id="cardExpiry"
                      placeholder="MM/YY"
                      value={paymentForm.cardExpiry}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cardExpiry: e.target.value }))}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardCVC">CVC</Label>
                    <Input
                      id="cardCVC"
                      placeholder="123"
                      value={paymentForm.cardCVC}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cardCVC: e.target.value }))}
                      maxLength={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentForm.paymentMethod === 'insurance' && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h4 className="font-medium">Insurance Details</h4>
                <div>
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    placeholder="Blue Cross, Aetna, etc."
                    value={paymentForm.insuranceProvider}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, insuranceProvider: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="claimNumber">Claim Number</Label>
                  <Input
                    id="claimNumber"
                    placeholder="CLM-2024-XXXX"
                    value={paymentForm.claimNumber}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, claimNumber: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <Label htmlFor="notes">Payment Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this payment..."
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Payment Summary</p>
              <p className="text-sm text-muted-foreground">
                Amount: ${paymentForm.amount || "0.00"} via {paymentForm.paymentMethod.replace('-', ' ')}
              </p>
            </div>
            <Badge variant="outline">
              <DollarSign className="w-3 h-3 mr-1" />
              ${paymentForm.amount || "0.00"}
            </Badge>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Receipt className="w-4 h-4 mr-2" />
              Process Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}