import React, { useState } from 'react';
import { Shield, Bell, Lock, Database } from 'lucide-react';

export const PrivacySettings = () => {
  const [dataSharing, setDataSharing] = useState(false);
  const [alerts, setAlerts] = useState(true);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Privacy Settings</h2>
      <p style={{ color: 'var(--text-secondary)', marginTop: '-0.5rem' }}>Manage how HushhTrust handles your data and notifications.</p>
      
      <div className="glass-panel flex flex-col gap-6" style={{ padding: '2rem' }}>
        
        <div className="flex justify-between items-center pb-6" style={{ borderBottom: '1px solid var(--glass-border)' }}>
          <div className="flex gap-4">
            <div className="p-2" style={{ background: 'var(--color-moderate-light)', borderRadius: '12px', color: 'var(--color-moderate)' }}>
              <Database size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600 }}>Anonymous Data Sharing</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Allow HushhTrust to use anonymous usage data to improve threat models.</p>
            </div>
          </div>
          <button 
            className={`glass-button cursor-pointer ${dataSharing ? 'primary' : ''}`} 
            onClick={() => setDataSharing(!dataSharing)}>
            {dataSharing ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <div className="flex justify-between items-center pb-6" style={{ borderBottom: '1px solid var(--glass-border)' }}>
          <div className="flex gap-4">
            <div className="p-2" style={{ background: 'var(--color-safe-light)', borderRadius: '12px', color: 'var(--color-safe)' }}>
              <Bell size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600 }}>Real-Time Alerts</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Receive notifications when an app accesses sensitive permissions.</p>
            </div>
          </div>
          <button 
            className={`glass-button cursor-pointer ${alerts ? 'primary' : ''}`} 
            onClick={() => setAlerts(!alerts)}>
            {alerts ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <div className="mt-2">
           <button className="glass-button cursor-pointer danger flex items-center gap-2">
             <Lock size={16} /> Delete All Local Data
           </button>
           <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
             This will wipe all tracked history from your device permanently.
           </p>
        </div>

      </div>
    </div>
  );
};
