import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { ConnectedApp, ActivityLog, Recommendation, DashboardMetrics, UserProfile, SensorEvent, WeeklyMetric } from '../types';
import { mockApps, mockActivities, mockRecommendations, mockMetrics } from './mockData';

interface DashboardContextType {
  user: UserProfile;
  apps: ConnectedApp[];
  activities: ActivityLog[];
  recommendations: Recommendation[];
  metrics: DashboardMetrics;
  sensorEvents: SensorEvent[];
  activeAlerts: SensorEvent[];
  weeklyMetrics: WeeklyMetric[];
  revokeAccess: (appId: string) => void;
  updatePermission: (appId: string, permissionId: string, isGranted: boolean) => void;
  dismissRecommendation: (recId: string) => void;
  dismissAlert: (eventId: string) => void;
  markAllAlertsAsRead: () => void;
  updateUser: (user: UserProfile) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  // Map to track last alert timestamp per app+sensor for cooldown
  const alertCooldownMap = useRef(new Map<string, number>());

  const [user, setUser] = useState<UserProfile>({ name: 'Jane Doe', email: 'jane.doe@hushh.com', avatarUrl: null });
  const [apps, setApps] = useState<ConnectedApp[]>(mockApps);
  const [activities, setActivities] = useState<ActivityLog[]>(mockActivities);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);
  const [sensorEvents, setSensorEvents] = useState<SensorEvent[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<SensorEvent[]>([]);
  
  // Weekly insight mocks statically aggregated
  const [weeklyMetrics, setWeeklyMetrics] = useState<WeeklyMetric[]>([
    { appName: 'Instagram', camera: 14, microphone: 5, location: 22, storage: 8, contacts: 2, totalOps: 51, riskTrend: 'Increasing' },
    { appName: 'Spotify', camera: 0, microphone: 12, location: 3, storage: 45, contacts: 0, totalOps: 60, riskTrend: 'Stable' },
    { appName: 'Uber', camera: 1, microphone: 0, location: 42, storage: 2, contacts: 5, totalOps: 50, riskTrend: 'Decreasing' },
    { appName: 'Snapchat', camera: 85, microphone: 30, location: 45, storage: 12, contacts: 15, totalOps: 187, riskTrend: 'Increasing' },
  ]);

  // Real-time Hardware Simulation Engine
  useEffect(() => {
    if (apps.length === 0) return;

    const generateSimulatedEvent = () => {
      const sensors: ('Camera' | 'Microphone' | 'Location' | 'Contacts' | 'Storage')[] = ['Camera', 'Microphone', 'Location', 'Contacts', 'Storage'];
      const targetApp = apps[Math.floor(Math.random() * apps.length)];
      const targetSensor = sensors[Math.floor(Math.random() * sensors.length)];
      
      const isBackground = Math.random() > 0.8;
      
      let severity: 'Safe' | 'Moderate' | 'Risky' = 'Safe';
      if (isBackground && (targetSensor === 'Camera' || targetSensor === 'Microphone')) {
        severity = 'Risky';
      } else if (isBackground && targetSensor === 'Contacts') {
        severity = 'Risky';
      } else if (isBackground && targetSensor === 'Location') {
        severity = 'Moderate';
      } else if (targetApp.riskLevel === 'Risky') {
        severity = 'Moderate';
      }

      let eventMsg = `${targetApp.name} accessed ${targetSensor} legitimately.`;
      if (severity === 'Risky') {
        eventMsg = `⚠️ Suspicious: ${targetApp.name} requested ${targetSensor} invisibly in the background.`;
      } else if (severity === 'Moderate') {
        eventMsg = `Background ping: ${targetApp.name} read your ${targetSensor}.`;
      }

      // Deduplication & cooldown check
      const now = Date.now();
      const cooldownMs = 5 * 60 * 1000; // 5 minutes cooldown window for grouping

      setActiveAlerts(prev => {
        // Find existing alert for same app + sensor within cooldown
        const existingIdx = prev.findIndex(a => 
          a.appName === targetApp.name && 
          a.sensorType === targetSensor && 
          (now - new Date(a.timestamp).getTime()) < cooldownMs
        );

        if (existingIdx !== -1) {
          // Increment count and update timestamp for deduplicated alert
          const updated = [...prev];
          const existCount = updated[existingIdx].count || 1;
          
          updated[existingIdx] = { 
            ...updated[existingIdx], 
            timestamp: new Date().toISOString(),
            count: existCount + 1,
            message: `${targetApp.name} accessed ${targetSensor} ${existCount + 1} times recently.`,
            read: false // bring it back to active attention
          };
          
          // Move the updated alert to the top of the list so it's fresh
          const target = updated.splice(existingIdx, 1)[0];
          return [target, ...updated];
        }

        // Output new event if no recent duplicate exists
        const newEvent: SensorEvent = {
          id: Math.random().toString(36).substring(7),
          appId: targetApp.id,
          appName: targetApp.name,
          sensorType: targetSensor,
          timestamp: new Date().toISOString(),
          isBackground,
          riskLevel: severity,
          message: eventMsg,
          read: false,
          count: 1
        };

        return [newEvent, ...prev].slice(0, 15); // max 15 active notifications
      });
      
      // Also inject into historical logs independently of active notifications
      setSensorEvents(prev => {
        const newLog: SensorEvent = {
          id: Math.random().toString(36).substring(7),
          appId: targetApp.id,
          appName: targetApp.name,
          sensorType: targetSensor,
          timestamp: new Date().toISOString(),
          isBackground,
          riskLevel: severity,
          message: eventMsg,
          read: true // Already handled by alert system
        };
        return [newLog, ...prev].slice(0, 50);
      });

    };

    // Run simulator (random 4s to 12s)
    const interval = setInterval(() => {
      generateSimulatedEvent();
    }, Math.floor(Math.random() * 8000) + 4000);

    return () => clearInterval(interval);
  }, [apps]);

  const dismissAlert = (eventId: string) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== eventId));
  };

  const markAllAlertsAsRead = () => {
    setActiveAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const updateUser = async (newUser: UserProfile) => {
    // Simulate API delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(newUser);
  };

  const revokeAccess = (appId: string) => {
    const updatedApps = apps.filter(app => app.id !== appId);
    setApps(updatedApps);
    
    // Revoking access reduces apps and data points (simplified math)
    setMetrics({
      ...metrics,
      totalApps: updatedApps.length,
      totalDataPointsShared: Math.max(0, metrics.totalDataPointsShared - 2)
    });
  };

  const updatePermission = (appId: string, permissionId: string, isGranted: boolean) => {
    setApps(apps.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          permissions: app.permissions.map(p => p.id === permissionId ? { ...p, isGranted } : p)
        };
      }
      return app;
    }));
  };

  const dismissRecommendation = (recId: string) => {
    setRecommendations(recommendations.filter(r => r.id !== recId));
  };

  return (
    <DashboardContext.Provider value={{ user, apps, activities, recommendations, metrics, sensorEvents, activeAlerts, weeklyMetrics, revokeAccess, updatePermission, dismissRecommendation, dismissAlert, markAllAlertsAsRead, updateUser }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
