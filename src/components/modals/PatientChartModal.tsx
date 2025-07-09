import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from "@/contexts/HospitalDataContext";
import { Heart, Thermometer, Activity, FileText, Clock, User } from "lucide-react";

interface PatientChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export function PatientChartModal({ isOpen, onClose, patient }: PatientChartModalProps) {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Chart - {patient.name}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Vitals History</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="notes">Care Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">{patient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Age:</span>
                    <span className="font-medium">{patient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gender:</span>
                    <span className="font-medium">{patient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bed:</span>
                    <span className="font-medium">{patient.bedNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Condition:</span>
                    <Badge variant={patient.condition === 'Critical' ? 'destructive' : 
                                  patient.condition === 'Stable' ? 'secondary' : 'default'}>
                      {patient.condition}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Doctor:</span>
                    <span className="font-medium">{patient.doctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admission:</span>
                    <span className="font-medium">{patient.admissionDate}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Current Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-destructive" />
                      <span>Heart Rate:</span>
                    </div>
                    <span className="font-medium">{patient.vitals.heartRate} BPM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span>Blood Pressure:</span>
                    </div>
                    <span className="font-medium">{patient.vitals.bloodPressure}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-warning" />
                      <span>Temperature:</span>
                    </div>
                    <span className="font-medium">{patient.vitals.temperature}°F</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-accent" />
                      <span>Oxygen Sat:</span>
                    </div>
                    <span className="font-medium">{patient.vitals.oxygenSat}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2">
                    Last updated: {patient.lastUpdated}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Diagnosis & Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Primary Diagnosis:</p>
                    <p className="text-muted-foreground">{patient.diagnosis}</p>
                  </div>
                  <div>
                    <p className="font-medium">Known Allergies:</p>
                    <div className="flex gap-2 flex-wrap">
                      {patient.allergies.length > 0 ? (
                        patient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive">{allergy}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">None recorded</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vitals History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patient.vitalsHistory.map((vital, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 p-3 border rounded">
                      <div className="text-sm">
                        <p className="font-medium">{vital.heartRate} BPM</p>
                        <p className="text-muted-foreground">Heart Rate</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{vital.bloodPressure}</p>
                        <p className="text-muted-foreground">BP</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{vital.temperature}°F</p>
                        <p className="text-muted-foreground">Temp</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{vital.oxygenSat}%</p>
                        <p className="text-muted-foreground">SpO2</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{new Date(vital.timestamp).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">{new Date(vital.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Medication Records</p>
                  <p className="text-muted-foreground">View detailed medication history and administration log</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Care Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Care Documentation</p>
                  <p className="text-muted-foreground">Nursing notes and care plan documentation</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}