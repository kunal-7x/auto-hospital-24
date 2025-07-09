import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: 'Critical' | 'Stable' | 'Good' | 'Fair';
  bedNumber: string;
  admissionDate: string;
  doctor: string;
  diagnosis: string;
  allergies: string[];
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSat: number;
    timestamp: string;
  };
  vitalsHistory: Array<{
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSat: number;
    timestamp: string;
  }>;
  lastUpdated: string;
  contactInfo: {
    phone: string;
    email: string;
    emergencyContact: string;
  };
  status: 'active' | 'discharged';
}

export interface Bed {
  id: string;
  number: string;
  ward: string;
  floor: number;
  status: 'occupied' | 'available' | 'maintenance' | 'cleaning';
  patientId?: string;
  assignedDate?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  phone: string;
  notes?: string;
}

export interface Order {
  id: string;
  patientId: string;
  patientName: string;
  type: 'Lab' | 'Imaging' | 'Pharmacy';
  test: string;
  doctor: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  ordered: string;
  priority: 'routine' | 'urgent' | 'stat';
  result?: string;
  completedDate?: string;
}

export interface Medication {
  id: string;
  patientId: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  doctor: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'discontinued';
  administrationLog: Array<{
    timestamp: string;
    administeredBy: string;
    notes?: string;
  }>;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: string;
  phone: string;
  email: string;
  status: 'active' | 'on-leave' | 'off-duty';
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  patientId?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Bill {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  items: Array<{
    description: string;
    amount: number;
  }>;
  insuranceClaimId?: string;
}

// Context
interface HospitalDataContextType {
  // Data
  patients: Patient[];
  beds: Bed[];
  appointments: Appointment[];
  orders: Order[];
  medications: Medication[];
  staff: Staff[];
  alerts: Alert[];
  bills: Bill[];
  
  // Patient Operations
  addPatient: (patient: Omit<Patient, 'id'>) => string;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  dischargePatient: (id: string) => void;
  updatePatientVitals: (id: string, vitals: Patient['vitals']) => void;
  
  // Bed Operations
  assignBed: (bedId: string, patientId: string) => void;
  releaseBed: (bedId: string) => void;
  transferPatient: (patientId: string, newBedId: string) => void;
  updateBedStatus: (bedId: string, status: Bed['status']) => void;
  
  // Appointment Operations
  addAppointment: (appointment: Omit<Appointment, 'id'>) => string;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  
  // Order Operations
  addOrder: (order: Omit<Order, 'id'>) => string;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  
  // Medication Operations
  addMedication: (medication: Omit<Medication, 'id'>) => string;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  administerMedication: (id: string, administeredBy: string, notes?: string) => void;
  
  // Staff Operations
  addStaff: (staff: Omit<Staff, 'id'>) => string;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  
  // Alert Operations
  addAlert: (alert: Omit<Alert, 'id'>) => string;
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;
  deleteAlert: (id: string) => void;
  
  // Bill Operations
  addBill: (bill: Omit<Bill, 'id'>) => string;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  
  // Analytics
  getAnalytics: () => any;
}

const HospitalDataContext = createContext<HospitalDataContextType | null>(null);

// Sample data generator
const generateSampleData = () => {
  const samplePatients: Patient[] = [
    {
      id: 'P001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      condition: 'Critical',
      bedNumber: 'ICU-01',
      admissionDate: '2024-01-15',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Acute Myocardial Infarction',
      allergies: ['Penicillin', 'Latex'],
      vitals: {
        heartRate: 120,
        bloodPressure: '140/90',
        temperature: 37.2,
        oxygenSat: 92,
        timestamp: new Date().toISOString()
      },
      vitalsHistory: [
        {
          heartRate: 118,
          bloodPressure: '138/88',
          temperature: 37.0,
          oxygenSat: 94,
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          heartRate: 115,
          bloodPressure: '135/85',
          temperature: 36.8,
          oxygenSat: 96,
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ],
      lastUpdated: '2 hours ago',
      contactInfo: {
        phone: '+1 (555) 123-4567',
        email: 'john.doe@email.com',
        emergencyContact: 'Jane Doe - Wife'
      },
      status: 'active'
    },
    {
      id: 'P002',
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      condition: 'Stable',
      bedNumber: 'GA-101',
      admissionDate: '2024-01-14',
      doctor: 'Dr. Michael Chen',
      diagnosis: 'Appendectomy Post-Op',
      allergies: ['Codeine'],
      vitals: {
        heartRate: 75,
        bloodPressure: '120/80',
        temperature: 36.8,
        oxygenSat: 98,
        timestamp: new Date().toISOString()
      },
      vitalsHistory: [
        {
          heartRate: 78,
          bloodPressure: '122/82',
          temperature: 37.0,
          oxygenSat: 97,
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ],
      lastUpdated: '30 minutes ago',
      contactInfo: {
        phone: '+1 (555) 987-6543',
        email: 'jane.smith@email.com',
        emergencyContact: 'Bob Smith - Husband'
      },
      status: 'active'
    }
  ];

  const sampleBeds: Bed[] = [
    { id: 'B001', number: 'ICU-01', ward: 'ICU', floor: 2, status: 'occupied', patientId: 'P001', assignedDate: '2024-01-15' },
    { id: 'B002', number: 'ICU-02', ward: 'ICU', floor: 2, status: 'available' },
    { id: 'B003', number: 'GA-101', ward: 'General A', floor: 1, status: 'occupied', patientId: 'P002', assignedDate: '2024-01-14' },
    { id: 'B004', number: 'GA-102', ward: 'General A', floor: 1, status: 'available' },
    { id: 'B005', number: 'GA-103', ward: 'General A', floor: 1, status: 'cleaning' },
    { id: 'B006', number: 'GA-104', ward: 'General A', floor: 1, status: 'maintenance' }
  ];

  const sampleAppointments: Appointment[] = [
    {
      id: 'A001',
      patientId: 'P001',
      patientName: 'John Doe',
      doctor: 'Dr. Wilson',
      date: '2024-01-15',
      time: '09:00',
      type: 'Consultation',
      status: 'confirmed',
      phone: '+1-555-0123'
    },
    {
      id: 'A002',
      patientId: 'P002',
      patientName: 'Jane Smith',
      doctor: 'Dr. Brown',
      date: '2024-01-15',
      time: '10:30',
      type: 'Follow-up',
      status: 'pending',
      phone: '+1-555-0124'
    }
  ];

  const sampleOrders: Order[] = [
    {
      id: 'O001',
      patientId: 'P001',
      patientName: 'John Doe',
      type: 'Lab',
      test: 'Complete Blood Count',
      doctor: 'Dr. Wilson',
      status: 'pending',
      ordered: '2024-01-15 09:30',
      priority: 'routine'
    },
    {
      id: 'O002',
      patientId: 'P002',
      patientName: 'Jane Smith',
      type: 'Imaging',
      test: 'Chest X-Ray',
      doctor: 'Dr. Brown',
      status: 'completed',
      ordered: '2024-01-15 08:15',
      priority: 'urgent',
      result: 'Normal chest findings',
      completedDate: '2024-01-15 10:30'
    }
  ];

  const sampleMedications: Medication[] = [
    {
      id: 'M001',
      patientId: 'P001',
      patientName: 'John Doe',
      medication: 'Aspirin',
      dosage: '81mg',
      frequency: 'Daily',
      doctor: 'Dr. Wilson',
      startDate: '2024-01-15',
      status: 'active',
      administrationLog: [
        {
          timestamp: new Date().toISOString(),
          administeredBy: 'Nurse Johnson'
        }
      ]
    }
  ];

  const sampleStaff: Staff[] = [
    {
      id: 'S001',
      name: 'Dr. Sarah Johnson',
      role: 'Doctor',
      department: 'Cardiology',
      shift: 'Day',
      phone: '+1-555-1001',
      email: 'sarah.johnson@hospital.com',
      status: 'active'
    },
    {
      id: 'S002',
      name: 'Nurse Mary Wilson',
      role: 'Nurse',
      department: 'ICU',
      shift: 'Night',
      phone: '+1-555-1002',
      email: 'mary.wilson@hospital.com',
      status: 'active'
    }
  ];

  const sampleAlerts: Alert[] = [
    {
      id: 'AL001',
      type: 'critical',
      title: 'Critical Patient Alert',
      message: 'Patient John Doe (ICU-01) showing irregular heart rhythm',
      timestamp: new Date().toISOString(),
      isRead: false,
      patientId: 'P001',
      priority: 'high'
    },
    {
      id: 'AL002',
      type: 'warning',
      title: 'Bed Shortage Warning',
      message: 'ICU occupancy at 90% - consider discharge planning',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      isRead: false,
      priority: 'medium'
    }
  ];

  const sampleBills: Bill[] = [
    {
      id: 'B001',
      patientId: 'P001',
      patientName: 'John Doe',
      amount: 15000,
      status: 'pending',
      dueDate: '2024-02-15',
      items: [
        { description: 'ICU Room Charges', amount: 8000 },
        { description: 'Diagnostic Tests', amount: 3500 },
        { description: 'Medications', amount: 2000 },
        { description: 'Doctor Consultation', amount: 1500 }
      ]
    }
  ];

  return {
    patients: samplePatients,
    beds: sampleBeds,
    appointments: sampleAppointments,
    orders: sampleOrders,
    medications: sampleMedications,
    staff: sampleStaff,
    alerts: sampleAlerts,
    bills: sampleBills
  };
};

export const HospitalDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('hospitalData');
    return savedData ? JSON.parse(savedData) : generateSampleData();
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('hospitalData', JSON.stringify(data));
  }, [data]);

  const generateId = (prefix: string) => {
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  };

  // Patient Operations
  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const id = generateId('P');
    const newPatient = { ...patient, id };
    setData(prev => ({
      ...prev,
      patients: [...prev.patients, newPatient]
    }));
    return id;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setData(prev => ({
      ...prev,
      patients: prev.patients.map(patient =>
        patient.id === id ? { ...patient, ...updates } : patient
      )
    }));
  };

  const deletePatient = (id: string) => {
    setData(prev => ({
      ...prev,
      patients: prev.patients.filter(patient => patient.id !== id),
      beds: prev.beds.map(bed => 
        bed.patientId === id ? { ...bed, patientId: undefined, status: 'available' as const } : bed
      )
    }));
  };

  const dischargePatient = (id: string) => {
    setData(prev => ({
      ...prev,
      patients: prev.patients.map(patient =>
        patient.id === id ? { ...patient, status: 'discharged' as const } : patient
      ),
      beds: prev.beds.map(bed => 
        bed.patientId === id ? { ...bed, patientId: undefined, status: 'cleaning' as const } : bed
      )
    }));
  };

  const updatePatientVitals = (id: string, vitals: Patient['vitals']) => {
    setData(prev => ({
      ...prev,
      patients: prev.patients.map(patient =>
        patient.id === id ? { 
          ...patient, 
          vitals,
          vitalsHistory: [vitals, ...patient.vitalsHistory],
          lastUpdated: 'Just now'
        } : patient
      )
    }));
  };

  // Bed Operations
  const assignBed = (bedId: string, patientId: string) => {
    setData(prev => ({
      ...prev,
      beds: prev.beds.map(bed =>
        bed.id === bedId ? { 
          ...bed, 
          patientId, 
          status: 'occupied' as const,
          assignedDate: new Date().toISOString().split('T')[0]
        } : bed
      ),
      patients: prev.patients.map(patient =>
        patient.id === patientId ? { 
          ...patient, 
          bedNumber: prev.beds.find(b => b.id === bedId)?.number || patient.bedNumber 
        } : patient
      )
    }));
  };

  const releaseBed = (bedId: string) => {
    setData(prev => ({
      ...prev,
      beds: prev.beds.map(bed =>
        bed.id === bedId ? { 
          ...bed, 
          patientId: undefined, 
          status: 'available' as const,
          assignedDate: undefined
        } : bed
      )
    }));
  };

  const transferPatient = (patientId: string, newBedId: string) => {
    const currentBed = data.beds.find(bed => bed.patientId === patientId);
    if (currentBed) {
      releaseBed(currentBed.id);
    }
    assignBed(newBedId, patientId);
  };

  const updateBedStatus = (bedId: string, status: Bed['status']) => {
    setData(prev => ({
      ...prev,
      beds: prev.beds.map(bed =>
        bed.id === bedId ? { ...bed, status } : bed
      )
    }));
  };

  // Appointment Operations
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const id = generateId('A');
    const newAppointment = { ...appointment, id };
    setData(prev => ({
      ...prev,
      appointments: [...prev.appointments, newAppointment]
    }));
    return id;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.map(appointment =>
        appointment.id === id ? { ...appointment, ...updates } : appointment
      )
    }));
  };

  const deleteAppointment = (id: string) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.filter(appointment => appointment.id !== id)
    }));
  };

  // Order Operations
  const addOrder = (order: Omit<Order, 'id'>) => {
    const id = generateId('O');
    const newOrder = { ...order, id };
    setData(prev => ({
      ...prev,
      orders: [...prev.orders, newOrder]
    }));
    return id;
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === id ? { ...order, ...updates } : order
      )
    }));
  };

  const deleteOrder = (id: string) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.filter(order => order.id !== id)
    }));
  };

  // Medication Operations
  const addMedication = (medication: Omit<Medication, 'id'>) => {
    const id = generateId('M');
    const newMedication = { ...medication, id };
    setData(prev => ({
      ...prev,
      medications: [...prev.medications, newMedication]
    }));
    return id;
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setData(prev => ({
      ...prev,
      medications: prev.medications.map(medication =>
        medication.id === id ? { ...medication, ...updates } : medication
      )
    }));
  };

  const deleteMedication = (id: string) => {
    setData(prev => ({
      ...prev,
      medications: prev.medications.filter(medication => medication.id !== id)
    }));
  };

  const administerMedication = (id: string, administeredBy: string, notes?: string) => {
    setData(prev => ({
      ...prev,
      medications: prev.medications.map(medication =>
        medication.id === id ? {
          ...medication,
          administrationLog: [
            {
              timestamp: new Date().toISOString(),
              administeredBy,
              notes
            },
            ...medication.administrationLog
          ]
        } : medication
      )
    }));
  };

  // Staff Operations
  const addStaff = (staff: Omit<Staff, 'id'>) => {
    const id = generateId('S');
    const newStaff = { ...staff, id };
    setData(prev => ({
      ...prev,
      staff: [...prev.staff, newStaff]
    }));
    return id;
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setData(prev => ({
      ...prev,
      staff: prev.staff.map(staffMember =>
        staffMember.id === id ? { ...staffMember, ...updates } : staffMember
      )
    }));
  };

  const deleteStaff = (id: string) => {
    setData(prev => ({
      ...prev,
      staff: prev.staff.filter(staffMember => staffMember.id !== id)
    }));
  };

  // Alert Operations
  const addAlert = (alert: Omit<Alert, 'id'>) => {
    const id = generateId('AL');
    const newAlert = { ...alert, id };
    setData(prev => ({
      ...prev,
      alerts: [newAlert, ...prev.alerts]
    }));
    return id;
  };

  const markAlertAsRead = (id: string) => {
    setData(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert =>
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    }));
  };

  const markAllAlertsAsRead = () => {
    setData(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => ({ ...alert, isRead: true }))
    }));
  };

  const deleteAlert = (id: string) => {
    setData(prev => ({
      ...prev,
      alerts: prev.alerts.filter(alert => alert.id !== id)
    }));
  };

  // Bill Operations
  const addBill = (bill: Omit<Bill, 'id'>) => {
    const id = generateId('B');
    const newBill = { ...bill, id };
    setData(prev => ({
      ...prev,
      bills: [...prev.bills, newBill]
    }));
    return id;
  };

  const updateBill = (id: string, updates: Partial<Bill>) => {
    setData(prev => ({
      ...prev,
      bills: prev.bills.map(bill =>
        bill.id === id ? { ...bill, ...updates } : bill
      )
    }));
  };

  const deleteBill = (id: string) => {
    setData(prev => ({
      ...prev,
      bills: prev.bills.filter(bill => bill.id !== id)
    }));
  };

  // Analytics
  const getAnalytics = () => {
    const totalPatients = data.patients.filter(p => p.status === 'active').length;
    const totalBeds = data.beds.length;
    const occupiedBeds = data.beds.filter(b => b.status === 'occupied').length;
    const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
    
    const conditionCounts = data.patients.reduce((acc, patient) => {
      if (patient.status === 'active') {
        acc[patient.condition] = (acc[patient.condition] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const todayAppointments = data.appointments.filter(apt => 
      apt.date === new Date().toISOString().split('T')[0]
    ).length;

    const pendingOrders = data.orders.filter(order => order.status === 'pending').length;
    const completedOrders = data.orders.filter(order => order.status === 'completed').length;

    const activeStaff = data.staff.filter(s => s.status === 'active').length;

    const totalRevenue = data.bills.reduce((sum, bill) => sum + bill.amount, 0);
    const pendingPayments = data.bills.filter(bill => bill.status === 'pending').length;

    return {
      totalPatients,
      totalBeds,
      occupiedBeds,
      occupancyRate,
      conditionCounts,
      todayAppointments,
      pendingOrders,
      completedOrders,
      activeStaff,
      totalRevenue,
      pendingPayments,
      unreadAlerts: data.alerts.filter(alert => !alert.isRead).length
    };
  };

  const value: HospitalDataContextType = {
    ...data,
    addPatient,
    updatePatient,
    deletePatient,
    dischargePatient,
    updatePatientVitals,
    assignBed,
    releaseBed,
    transferPatient,
    updateBedStatus,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addOrder,
    updateOrder,
    deleteOrder,
    addMedication,
    updateMedication,
    deleteMedication,
    administerMedication,
    addStaff,
    updateStaff,
    deleteStaff,
    addAlert,
    markAlertAsRead,
    markAllAlertsAsRead,
    deleteAlert,
    addBill,
    updateBill,
    deleteBill,
    getAnalytics
  };

  return (
    <HospitalDataContext.Provider value={value}>
      {children}
    </HospitalDataContext.Provider>
  );
};

export const useHospitalData = () => {
  const context = useContext(HospitalDataContext);
  if (!context) {
    throw new Error('useHospitalData must be used within a HospitalDataProvider');
  }
  return context;
};