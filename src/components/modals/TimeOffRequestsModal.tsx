import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, CheckCircle, X, Eye } from "lucide-react";

interface TimeOffRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimeOffRequest {
  id: string;
  staffId: string;
  staffName: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency' | 'family';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  requestDate: string;
  coverageArranged: boolean;
}

export function TimeOffRequestsModal({ isOpen, onClose }: TimeOffRequestsModalProps) {
  const { staff } = useHospitalData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'new' | 'pending'>('overview');
  
  const [requests, setRequests] = useState<TimeOffRequest[]>([
    {
      id: '1',
      staffId: 'S001',
      staffName: 'Dr. Sarah Johnson',
      type: 'vacation',
      startDate: '2024-01-25',
      endDate: '2024-01-30',
      reason: 'Family vacation to Hawaii',
      status: 'pending',
      requestDate: '2024-01-15',
      coverageArranged: true
    },
    {
      id: '2', 
      staffId: 'S002',
      staffName: 'Nurse Mary Wilson',
      type: 'sick',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      reason: 'Medical appointment and recovery',
      status: 'approved',
      requestDate: '2024-01-18',
      coverageArranged: true
    },
    {
      id: '3',
      staffId: 'S003',
      staffName: 'Dr. Mike Johnson',
      type: 'personal',
      startDate: '2024-02-05',
      endDate: '2024-02-05',
      reason: 'Personal matter',
      status: 'denied',
      requestDate: '2024-01-10',
      coverageArranged: false
    }
  ]);

  const [newRequest, setNewRequest] = useState({
    staffId: '',
    type: 'vacation' as TimeOffRequest['type'],
    startDate: '',
    endDate: '',
    reason: '',
    coverageArranged: false
  });

  const handleNewRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRequest.staffId || !newRequest.startDate || !newRequest.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedStaff = staff.find(s => s.id === newRequest.staffId);
    const requestId = `REQ-${Date.now()}`;
    
    const newTimeOffRequest: TimeOffRequest = {
      id: requestId,
      staffId: newRequest.staffId,
      staffName: selectedStaff?.name || 'Unknown',
      type: newRequest.type,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      reason: newRequest.reason,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
      coverageArranged: newRequest.coverageArranged
    };
    
    setRequests(prev => [newTimeOffRequest, ...prev]);
    
    toast({
      title: "Request Submitted",
      description: `Time-off request ${requestId} submitted for ${selectedStaff?.name}`,
    });

    setNewRequest({
      staffId: '',
      type: 'vacation',
      startDate: '',
      endDate: '',
      reason: '',
      coverageArranged: false
    });
    
    setActiveTab('overview');
  };

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));
    
    const request = requests.find(r => r.id === requestId);
    toast({
      title: "Request Approved",
      description: `Time-off request for ${request?.staffName} has been approved`,
    });
  };

  const handleDeny = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'denied' as const } : req
    ));
    
    const request = requests.find(r => r.id === requestId);
    toast({
      title: "Request Denied", 
      description: `Time-off request for ${request?.staffName} has been denied`,
      variant: "destructive"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'warning';
      case 'denied': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vacation': return 'default';
      case 'sick': return 'warning';
      case 'emergency': return 'destructive';
      case 'personal': return 'secondary';
      case 'family': return 'secondary';
      default: return 'secondary';
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const approvedRequests = requests.filter(req => req.status === 'approved');
  const deniedRequests = requests.filter(req => req.status === 'denied');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Time-off Requests Management
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
            variant={activeTab === 'new' ? 'default' : 'outline'}
            onClick={() => setActiveTab('new')}
          >
            New Request
          </Button>
          <Button 
            variant={activeTab === 'pending' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({pendingRequests.length})
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{requests.length}</p>
                    <p className="text-sm text-muted-foreground">Total Requests</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">{pendingRequests.length}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">{approvedRequests.length}</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-destructive">{deniedRequests.length}</p>
                    <p className="text-sm text-muted-foreground">Denied</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Requests List */}
            <div className="space-y-3">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium">{request.staffName}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.startDate} to {request.endDate}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Requested: {request.requestDate} • {request.reason}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge variant={getTypeColor(request.type) as any} className="mb-1">
                            {request.type}
                          </Badge>
                          <br />
                          <Badge variant={getStatusColor(request.status) as any}>
                            {request.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {request.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleApprove(request.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeny(request.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
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
          <form onSubmit={handleNewRequestSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="staff">Staff Member *</Label>
                <Select value={newRequest.staffId} onValueChange={(value) => setNewRequest(prev => ({ ...prev, staffId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.filter(s => s.status === 'active').map(staffMember => (
                      <SelectItem key={staffMember.id} value={staffMember.id}>
                        {staffMember.name} - {staffMember.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Request Type *</Label>
                <Select value={newRequest.type} onValueChange={(value) => setNewRequest(prev => ({ ...prev, type: value as TimeOffRequest['type'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newRequest.startDate}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newRequest.endDate}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Request</Label>
              <Textarea
                id="reason"
                placeholder="Please provide details about your time-off request..."
                value={newRequest.reason}
                onChange={(e) => setNewRequest(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="coverage"
                checked={newRequest.coverageArranged}
                onChange={(e) => setNewRequest(prev => ({ ...prev, coverageArranged: e.target.checked }))}
              />
              <Label htmlFor="coverage">Coverage has been arranged</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setActiveTab('overview')}>
                Cancel
              </Button>
              <Button type="submit">
                <Calendar className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{request.staffName}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.type} • {request.startDate} to {request.endDate}
                        </p>
                        <p className="text-xs text-muted-foreground">{request.reason}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeny(request.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Deny
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingRequests.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium">No Pending Requests</p>
                      <p className="text-muted-foreground">All time-off requests have been processed</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}