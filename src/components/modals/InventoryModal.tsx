import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Package, AlertTriangle, Plus, Minus } from "lucide-react";

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  minLevel: number;
  maxLevel: number;
  unitCost: number;
  expiry: string;
  location: string;
  supplier: string;
  status: 'adequate' | 'low' | 'critical' | 'expired';
}

export function InventoryModal({ isOpen, onClose }: InventoryModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'reorder' | 'update'>('overview');
  
  const [inventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Amoxicillin 500mg',
      stock: 145,
      minLevel: 50,
      maxLevel: 300,
      unitCost: 2.45,
      expiry: '2024-12-15',
      location: 'Pharmacy A-1',
      supplier: 'MedSupply Corp',
      status: 'adequate'
    },
    {
      id: '2',
      name: 'Ibuprofen 400mg',
      stock: 25,
      minLevel: 30,
      maxLevel: 150,
      unitCost: 1.85,
      expiry: '2024-08-20',
      location: 'Pharmacy A-2',
      supplier: 'PharmaCo Ltd',
      status: 'low'
    },
    {
      id: '3',
      name: 'Insulin Glargine',
      stock: 8,
      minLevel: 10,
      maxLevel: 50,
      unitCost: 45.20,
      expiry: '2024-03-15',
      location: 'Cold Storage',
      supplier: 'BioMed Solutions',
      status: 'critical'
    }
  ]);

  const [reorderForm, setReorderForm] = useState({
    itemId: '',
    quantity: '',
    urgency: 'normal'
  });

  const [stockUpdate, setStockUpdate] = useState({
    itemId: '',
    adjustment: '',
    reason: '',
    type: 'add'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'adequate': return 'default';
      case 'low': return 'warning';
      case 'critical': return 'destructive';
      case 'expired': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleReorder = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === reorderForm.itemId);
    if (item) {
      toast({
        title: "Reorder Initiated",
        description: `Reorder for ${reorderForm.quantity} units of ${item.name} has been submitted`,
      });
      setReorderForm({ itemId: '', quantity: '', urgency: 'normal' });
      setActiveTab('overview');
    }
  };

  const handleStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === stockUpdate.itemId);
    if (item) {
      toast({
        title: "Stock Updated",
        description: `Stock ${stockUpdate.type === 'add' ? 'increased' : 'decreased'} by ${stockUpdate.adjustment} units for ${item.name}`,
      });
      setStockUpdate({ itemId: '', adjustment: '', reason: '', type: 'add' });
      setActiveTab('overview');
    }
  };

  const lowStockItems = inventory.filter(item => item.status === 'low' || item.status === 'critical');
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.unitCost), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory Management
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button 
            variant={activeTab === 'reorder' ? 'default' : 'outline'}
            onClick={() => setActiveTab('reorder')}
          >
            Reorder
          </Button>
          <Button 
            variant={activeTab === 'update' ? 'default' : 'outline'}
            onClick={() => setActiveTab('update')}
          >
            Stock Update
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{inventory.length}</p>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-destructive">{lowStockItems.length}</p>
                    <p className="text-sm text-muted-foreground">Low Stock</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inventory List */}
            <div className="space-y-3">
              {inventory.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Package className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.location} • {item.supplier}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold">{item.stock}</p>
                          <p className="text-sm text-muted-foreground">Min: {item.minLevel}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${item.unitCost}</p>
                          <p className="text-xs text-muted-foreground">per unit</p>
                        </div>
                        <Badge variant={getStatusColor(item.status) as any}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reorder' && (
          <form onSubmit={handleReorder} className="space-y-4">
            <div>
              <Label htmlFor="reorderItem">Select Item</Label>
              <Select value={reorderForm.itemId} onValueChange={(value) => setReorderForm(prev => ({ ...prev, itemId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select medication to reorder" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - Current: {item.stock}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity to Order</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={reorderForm.quantity}
                  onChange={(e) => setReorderForm(prev => ({ ...prev, quantity: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={reorderForm.urgency} onValueChange={(value) => setReorderForm(prev => ({ ...prev, urgency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setActiveTab('overview')}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Reorder
              </Button>
            </DialogFooter>
          </form>
        )}

        {activeTab === 'update' && (
          <form onSubmit={handleStockUpdate} className="space-y-4">
            <div>
              <Label htmlFor="updateItem">Select Item</Label>
              <Select value={stockUpdate.itemId} onValueChange={(value) => setStockUpdate(prev => ({ ...prev, itemId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select medication to update" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - Current: {item.stock}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="updateType">Adjustment Type</Label>
                <Select value={stockUpdate.type} onValueChange={(value) => setStockUpdate(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Stock</SelectItem>
                    <SelectItem value="remove">Remove Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="adjustment">Quantity</Label>
                <Input
                  id="adjustment"
                  type="number"
                  placeholder="Enter quantity"
                  value={stockUpdate.adjustment}
                  onChange={(e) => setStockUpdate(prev => ({ ...prev, adjustment: e.target.value }))}
                  required
                />
              </div>
              <div className="flex items-end">
                <Button type="button" variant="outline" size="sm" className="w-full">
                  {stockUpdate.type === 'add' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Adjustment</Label>
              <Textarea
                id="reason"
                placeholder="Explain the reason for this stock adjustment..."
                value={stockUpdate.reason}
                onChange={(e) => setStockUpdate(prev => ({ ...prev, reason: e.target.value }))}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setActiveTab('overview')}>
                Cancel
              </Button>
              <Button type="submit">
                Update Stock
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}