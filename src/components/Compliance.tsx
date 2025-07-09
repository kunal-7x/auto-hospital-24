import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  Search,
  Eye,
  Calendar,
  Plus,
  FileText,
  UserCheck,
  Settings
} from "lucide-react";

const mockAudits = [
  {
    id: 1,
    type: "HIPAA Compliance",
    status: "compliant",
    lastCheck: "2024-01-10",
    nextDue: "2024-04-10",
    score: 98
  },
  {
    id: 2,
    type: "Joint Commission",
    status: "pending",
    lastCheck: "2024-01-05",
    nextDue: "2024-01-25",
    score: 85
  },
  {
    id: 3,
    type: "Fire Safety",
    status: "non-compliant",
    lastCheck: "2024-01-08",
    nextDue: "2024-01-20",
    score: 72
  },
  {
    id: 4,
    type: "Medication Safety",
    status: "compliant",
    lastCheck: "2024-01-12",
    nextDue: "2024-02-12",
    score: 96
  }
];

const mockLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 14:30:25",
    user: "Dr. Smith",
    action: "Patient Record Access",
    resource: "Patient #12345",
    status: "success",
    ip: "192.168.1.100"
  },
  {
    id: 2,
    timestamp: "2024-01-15 14:28:10",
    user: "Nurse Johnson",
    action: "Medication Administration",
    resource: "Patient #12346",
    status: "success",
    ip: "192.168.1.101"
  },
  {
    id: 3,
    timestamp: "2024-01-15 14:25:55",
    user: "Admin Wilson",
    action: "Failed Login Attempt",
    resource: "Authentication System",
    status: "failed",
    ip: "192.168.1.102"
  }
];

export function Compliance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [scheduleAuditOpen, setScheduleAuditOpen] = useState(false);
  const [newPolicyOpen, setNewPolicyOpen] = useState(false);
  const [auditForm, setAuditForm] = useState({
    type: "",
    date: "",
    auditor: "",
    scope: "",
    notes: ""
  });
  const [policyForm, setPolicyForm] = useState({
    name: "",
    version: "",
    description: "",
    content: ""
  });
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant": return "success";
      case "pending": return "warning";
      case "non-compliant": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "non-compliant": return <AlertTriangle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const filteredLogs = mockLogs.filter(log =>
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportReport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} compliance report...`,
    });
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Compliance report exported as ${format.toUpperCase()}`,
      });
    }, 2000);
  };

  const handleScheduleAudit = () => {
    toast({
      title: "Audit Scheduled",
      description: `${auditForm.type} audit scheduled for ${auditForm.date}`,
    });
    setScheduleAuditOpen(false);
    setAuditForm({ type: "", date: "", auditor: "", scope: "", notes: "" });
  };

  const handleCreatePolicy = () => {
    toast({
      title: "Policy Created",
      description: `Policy "${policyForm.name}" has been created successfully`,
    });
    setNewPolicyOpen(false);
    setPolicyForm({ name: "", version: "", description: "", content: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compliance & Audit</h1>
          <p className="text-muted-foreground">Monitor regulatory compliance and audit trails</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => handleExportReport('pdf')}>
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => handleExportReport('excel')}>
            <FileText className="w-4 h-4" />
            Export Excel
          </Button>
          <Button className="gap-2" onClick={() => setScheduleAuditOpen(true)}>
            <Calendar className="w-4 h-4" />
            Schedule Audit
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-sm text-muted-foreground">Overall Compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">Passed Audits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Action Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAudits.map((audit) => (
                  <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(audit.status)}
                      <div>
                        <p className="font-medium">{audit.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Last checked: {audit.lastCheck} • Next due: {audit.nextDue}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium">{audit.score}%</p>
                        <Badge variant={getStatusColor(audit.status) as any}>
                          {audit.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Shield className="w-8 h-8 mx-auto text-primary mb-2" />
                        <p className="font-medium">HIPAA Compliance</p>
                        <p className="text-sm text-muted-foreground">Privacy & Security</p>
                        <Button size="sm" className="mt-2" onClick={() => setScheduleAuditOpen(true)}>Schedule Audit</Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <FileCheck className="w-8 h-8 mx-auto text-primary mb-2" />
                        <p className="font-medium">Joint Commission</p>
                        <p className="text-sm text-muted-foreground">Quality Standards</p>
                        <Button size="sm" className="mt-2" onClick={() => setScheduleAuditOpen(true)}>Schedule Audit</Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <CheckCircle className="w-8 h-8 mx-auto text-primary mb-2" />
                        <p className="font-medium">Fire Safety</p>
                        <p className="text-sm text-muted-foreground">Emergency Preparedness</p>
                        <Button size="sm" className="mt-2" onClick={() => setScheduleAuditOpen(true)}>Schedule Audit</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Audit Trail</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-success' : 'bg-destructive'}`} />
                      <div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.user} • {log.resource} • {log.ip}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                      <Badge variant={log.status === 'success' ? 'secondary' : 'destructive'} className="text-xs">
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Policy Management</CardTitle>
                <Button onClick={() => setNewPolicyOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Policy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "Patient Privacy Policy", version: "v2.1", lastUpdated: "2024-01-10", status: "active" },
                  { name: "Data Security Guidelines", version: "v1.8", lastUpdated: "2024-01-08", status: "active" },
                  { name: "Emergency Response Plan", version: "v3.0", lastUpdated: "2024-01-05", status: "review" },
                  { name: "Medication Administration", version: "v2.5", lastUpdated: "2024-01-12", status: "active" }
                ].map((policy, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{policy.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {policy.version} • Updated {policy.lastUpdated}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                            {policy.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Schedule Audit Modal */}
      <Dialog open={scheduleAuditOpen} onOpenChange={setScheduleAuditOpen}>
        <DialogContent className="max-w-2xl" aria-describedby="schedule-audit-description">
          <DialogHeader>
            <DialogTitle>Schedule Audit</DialogTitle>
            <p id="schedule-audit-description" className="text-sm text-muted-foreground">
              Schedule a new compliance audit for your organization
            </p>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="audit-type">Audit Type</Label>
              <Select value={auditForm.type} onValueChange={(value) => setAuditForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hipaa">HIPAA Compliance</SelectItem>
                  <SelectItem value="joint-commission">Joint Commission</SelectItem>
                  <SelectItem value="fire-safety">Fire Safety</SelectItem>
                  <SelectItem value="medication-safety">Medication Safety</SelectItem>
                  <SelectItem value="infection-control">Infection Control</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="audit-date">Audit Date</Label>
              <Input
                id="audit-date"
                type="date"
                value={auditForm.date}
                onChange={(e) => setAuditForm(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="auditor">Auditor</Label>
              <Select value={auditForm.auditor} onValueChange={(value) => setAuditForm(prev => ({ ...prev, auditor: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select auditor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal Team</SelectItem>
                  <SelectItem value="external">External Auditor</SelectItem>
                  <SelectItem value="regulatory">Regulatory Body</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scope">Audit Scope</Label>
              <Select value={auditForm.scope} onValueChange={(value) => setAuditForm(prev => ({ ...prev, scope: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Hospital</SelectItem>
                  <SelectItem value="department">Specific Department</SelectItem>
                  <SelectItem value="process">Specific Process</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes or requirements..."
              value={auditForm.notes}
              onChange={(e) => setAuditForm(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleAuditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleAudit}>
              Schedule Audit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Policy Modal */}
      <Dialog open={newPolicyOpen} onOpenChange={setNewPolicyOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="new-policy-description">
          <DialogHeader>
            <DialogTitle>Create New Policy</DialogTitle>
            <p id="new-policy-description" className="text-sm text-muted-foreground">
              Create a new hospital policy document
            </p>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="policy-name">Policy Name</Label>
              <Input
                id="policy-name"
                placeholder="Enter policy name"
                value={policyForm.name}
                onChange={(e) => setPolicyForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="policy-version">Version</Label>
              <Input
                id="policy-version"
                placeholder="e.g., v1.0"
                value={policyForm.version}
                onChange={(e) => setPolicyForm(prev => ({ ...prev, version: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="policy-description">Description</Label>
            <Input
              id="policy-description"
              placeholder="Brief description of the policy"
              value={policyForm.description}
              onChange={(e) => setPolicyForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="policy-content">Policy Content</Label>
            <Textarea
              id="policy-content"
              placeholder="Enter the full policy content..."
              value={policyForm.content}
              onChange={(e) => setPolicyForm(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[200px]"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPolicyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePolicy}>
              Create Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}