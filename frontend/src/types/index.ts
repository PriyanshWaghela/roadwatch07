export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'citizen' | 'authority';
  phone?: string;
  avatar?: string;
  location?: { lat: number; lng: number; address: string };
  notificationPrefs: { email: boolean; push: boolean; inApp: boolean };
  createdAt: string;
  updatedAt: string;
}

export interface AIAnalysis {
  damageType: string;
  severity: string;
  confidence: number;
  roadHealthScore: number;
  boundingBoxes: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    confidence: number;
  }>;
  recommendations: string[];
  estimatedRepairCost: number;
  estimatedRepairDays: number;
}

export interface Complaint {
  _id: string;
  citizen: User | string;
  title: string;
  description: string;
  images: Array<{ url: string; publicId: string }>;
  videos: Array<{ url: string; publicId: string }>;
  location: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
  category: 'pothole' | 'crack' | 'waterlogging' | 'road_damage' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'submitted' | 'verified' | 'in_progress' | 'resolved' | 'rejected';
  priority: number;
  aiAnalysis?: AIAnalysis;
  assignedAuthority?: User | string;
  statusHistory: Array<{
    status: string;
    updatedBy: User | string;
    timestamp: string;
    note: string;
  }>;
  validationScore: number;
  isDuplicate: boolean;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoadAnalytics {
  _id: string;
  area: string;
  roadHealthScore: number;
  totalComplaints: number;
  resolvedComplaints: number;
  averageResolutionDays: number;
  severityDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  trendData: Array<{
    date: string;
    healthScore: number;
    complaints: number;
  }>;
}

export interface PublicSpending {
  _id: string;
  area: string;
  fiscalYear: string;
  allocatedBudget: number;
  releasedBudget: number;
  spentBudget: number;
  projects: Array<{
    name: string;
    contractor: string;
    allocatedAmount: number;
    spentAmount: number;
    status: string;
    startDate: string;
    endDate: string;
  }>;
  transparencyScore: number;
}

export interface Notification {
  _id: string;
  user: string;
  type: string;
  title: string;
  message: string;
  relatedComplaint?: string;
  read: boolean;
  createdAt: string;
}

export interface AnalyticsOverview {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  criticalComplaints: number;
  averageResolutionTime: number;
  roadHealthIndex: number;
}
