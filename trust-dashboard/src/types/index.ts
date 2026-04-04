export type RiskLevel = 'Safe' | 'Moderate' | 'Risky';
export type DataCategory = 'Location' | 'Contacts' | 'Photos' | 'Microphone' | 'Camera' | 'Health' | 'Browsing History' | 'Financial';

export interface SensorEvent {
  id: string;
  appId: string;
  appName: string;
  sensorType: 'Camera' | 'Microphone' | 'Location' | 'Contacts' | 'Storage';
  timestamp: string;
  isBackground: boolean;
  riskLevel: RiskLevel;
  message: string;
  read: boolean;
  count?: number;
}

export interface WeeklyMetric {
  appName: string;
  camera: number;
  microphone: number;
  location: number;
  storage: number;
  contacts: number;
  totalOps: number;
  riskTrend: 'Increasing' | 'Stable' | 'Decreasing';
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface AppPermission {
  id: string;
  category: DataCategory;
  isOptional: boolean;
  isGranted: boolean;
  purpose: string;
}

export interface ConnectedApp {
  id: string;
  name: string;
  logoUrl: string; // We'll just use a colored div circle or Lucide icon since we don't have actual logos
  riskLevel: RiskLevel;
  trustScore: number; /* 0-100 */
  lastAccessed: string;
  dataCategories: DataCategory[];
  permissions: AppPermission[];
  usageFrequency: 'High' | 'Medium' | 'Low' | 'Unused';
  riskExplanation: string;
}

export interface ActivityLog {
  id: string;
  appId: string;
  appName: string;
  category: DataCategory;
  timestamp: string;
  action: 'Accessed' | 'Requested' | 'Revoked';
}

export interface Recommendation {
  id: string;
  appId?: string;
  title: string;
  description: string;
  type: 'Remove' | 'Limit' | 'Review';
}

export interface DashboardMetrics {
  overallTrustScore: number;
  totalApps: number;
  totalDataPointsShared: number;
  safeApps: number;
  moderateApps: number;
  riskyApps: number;
}
