import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useHospitalData } from "@/contexts/HospitalDataContext";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckSquare, AlertCircle, Plus } from "lucide-react";

interface TaskManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Task {
  id: string;
  patientId: string;
  patientName: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueTime: string;
  completed: boolean;
  assignedTo: string;
}

export function TaskManagementModal({ isOpen, onClose }: TaskManagementModalProps) {
  const { patients } = useHospitalData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'view' | 'create'>('view');
  
  // Mock tasks - in a real app, this would come from context
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      patientId: 'P001',
      patientName: 'John Doe',
      description: 'Medication administration - Aspirin 81mg',
      priority: 'urgent',
      dueTime: '14:00',
      completed: false,
      assignedTo: 'Nurse Johnson'
    },
    {
      id: '2',
      patientId: 'P002',
      patientName: 'Jane Smith',
      description: 'Vital signs check',
      priority: 'high',
      dueTime: '15:30',
      completed: false,
      assignedTo: 'Nurse Johnson'
    },
    {
      id: '3',
      patientId: 'P001',
      patientName: 'John Doe',
      description: 'Wound dressing change',
      priority: 'medium',
      dueTime: '16:00',
      completed: true,
      assignedTo: 'Nurse Johnson'
    }
  ]);

  const [newTask, setNewTask] = useState({
    patientId: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueTime: '',
    assignedTo: 'Nurse Johnson'
  });

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: task.completed ? "Task Marked Incomplete" : "Task Completed",
        description: `${task.description} for ${task.patientName}`,
      });
    }
  };

  const addNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.patientId || !newTask.description || !newTask.dueTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const patient = patients.find(p => p.id === newTask.patientId);
    if (!patient) return;

    const task: Task = {
      id: Date.now().toString(),
      patientId: newTask.patientId,
      patientName: patient.name,
      description: newTask.description,
      priority: newTask.priority,
      dueTime: newTask.dueTime,
      completed: false,
      assignedTo: newTask.assignedTo
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      patientId: '',
      description: '',
      priority: 'medium',
      dueTime: '',
      assignedTo: 'Nurse Johnson'
    });

    toast({
      title: "Task Created",
      description: `New task added for ${patient.name}`,
    });

    setActiveTab('view');
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return AlertCircle;
      case 'high': return Clock;
      default: return CheckSquare;
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Management</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Button 
            variant={activeTab === 'view' ? 'default' : 'outline'}
            onClick={() => setActiveTab('view')}
          >
            View Tasks
          </Button>
          <Button 
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </div>

        {activeTab === 'view' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Pending Tasks ({pendingTasks.length})</h3>
              <div className="space-y-3">
                {pendingTasks.map((task) => {
                  const PriorityIcon = getPriorityIcon(task.priority);
                  return (
                    <Card key={task.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox 
                              checked={task.completed}
                              onCheckedChange={() => toggleTaskCompletion(task.id)}
                            />
                            <PriorityIcon className="w-4 h-4" />
                            <div>
                              <p className="font-medium">{task.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {task.patientName} • Due: {task.dueTime} • Assigned to: {task.assignedTo}
                              </p>
                            </div>
                          </div>
                          <Badge variant={getPriorityColor(task.priority) as any}>
                            {task.priority}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Completed Tasks ({completedTasks.length})</h3>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <Card key={task.id} className="opacity-60">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                          />
                          <CheckSquare className="w-4 h-4 text-success" />
                          <div>
                            <p className="font-medium line-through">{task.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {task.patientName} • Completed
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">completed</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <form onSubmit={addNewTask} className="space-y-4">
            <div>
              <Label htmlFor="patient">Patient *</Label>
              <Select value={newTask.patientId} onValueChange={(value) => setNewTask(prev => ({ ...prev, patientId: value }))}>
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
              <Label htmlFor="description">Task Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the task to be completed..."
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as Task['priority'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dueTime">Due Time *</Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={newTask.dueTime}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueTime: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                placeholder="Nurse name"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setActiveTab('view')}>
                Cancel
              </Button>
              <Button type="submit">
                Create Task
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}