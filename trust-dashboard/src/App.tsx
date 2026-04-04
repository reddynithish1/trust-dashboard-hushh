import React, { useState, useEffect } from 'react';
import { DashboardProvider } from './data/DashboardContext';
import { Layout } from './components/layout/Layout';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { AppGrid } from './components/apps/AppGrid';
import { AlertSystem } from './components/dashboard/AlertSystem';
import { ActivityTimeline } from './components/dashboard/ActivityTimeline';
import { WeeklyInsights } from './components/dashboard/WeeklyInsights';
import { EditProfile } from './components/profile/EditProfile';
import { PrivacySettings } from './components/profile/PrivacySettings';
import { Login } from './components/auth/Login';
import { Shield } from 'lucide-react';

function AppContent({ onLogout }: { onLogout: () => void }) {
  const [activeView, setActiveView] = useState('Overview');

  return (
    <Layout activeView={activeView} setActiveView={setActiveView} onLogout={onLogout}>
      {activeView === 'Overview' && <DashboardHome setActiveView={setActiveView} />}
      {activeView === 'Apps' && (
        <div className="flex flex-col gap-6">
           <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Manage Connected Apps</h3>
           <AppGrid showFilters={true} />
        </div>
      )}
      {activeView === 'Insights' && <WeeklyInsights />}
      {activeView === 'Logs' && <ActivityTimeline />}
      {activeView === 'Recommendations' && <AlertSystem />}
      {activeView === 'EditProfile' && <EditProfile />}
      {activeView === 'PrivacySettings' && <PrivacySettings />}
    </Layout>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check locally persisted identities across reloads
    const session = localStorage.getItem('hushhtrust_session');
    if (session) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('hushhtrust_session');
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) return null; // Avoid flicker

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <DashboardProvider>
      <AppContent onLogout={handleLogout} />
    </DashboardProvider>
  );
}

export default App;