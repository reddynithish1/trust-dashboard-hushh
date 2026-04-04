import React, { useState } from 'react';
import { ConnectedApp } from '../../types';
import { X, ShieldAlert, ShieldCheck, Activity, Trash2, Info, ShieldOff } from 'lucide-react';
import { useDashboard } from '../../data/DashboardContext';
import { AppLogo } from './AppLogo';
import { getTrustScoreColor } from '../../utils/colors';

export const AppDetailModal = ({ app, onClose }: { app: ConnectedApp, onClose: () => void }) => {
  const { updatePermission, revokeAccess } = useDashboard();
  const [activeTab, setActiveTab] = useState<'Permissions' | 'Activity'>('Permissions');
  
  const handleRevoke = () => {
    revokeAccess(app.id);
    onClose();
  };

  return (
    <div className="fixed" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '2rem' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backdropFilter: 'blur(8px)', zIndex: -1 }} onClick={onClose} />
      
      <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.85)', width: '100%', maxWidth: '640px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        {/* Header */}
        <div className="flex justify-between items-start" style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="flex items-center gap-4">
            <AppLogo name={app.name} fallbackIcon={app.logoUrl} size={48} />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{app.name}</h2>
              <div className="flex items-center gap-2" style={{ marginTop: '0.25rem' }}>
                <span className={`badge-${app.riskLevel.toLowerCase()}`} style={{ padding: '0.125rem 0.5rem', fontSize: '0.75rem' }}>{app.riskLevel} Risk</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>• Score: <span style={{ color: getTrustScoreColor(app.trustScore), fontWeight: 600 }}>{app.trustScore}</span>/100</span>
              </div>
            </div>
          </div>
          <button className="glass-button cursor-pointer" onClick={onClose} style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ padding: '0 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', gap: '1.5rem' }}>
          <button 
            className="cursor-pointer"
            onClick={() => setActiveTab('Permissions')}
            style={{ padding: '1rem 0', background: 'transparent', border: 'none', borderBottom: activeTab === 'Permissions' ? '2px solid var(--primary-accent)' : '2px solid transparent', color: activeTab === 'Permissions' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 600, transition: 'all 0.2s', outline: 'none' }}
          >
            Permissions
          </button>
          <button 
            className="cursor-pointer"
            onClick={() => setActiveTab('Activity')}
            style={{ padding: '1rem 0', background: 'transparent', border: 'none', borderBottom: activeTab === 'Activity' ? '2px solid var(--primary-accent)' : '2px solid transparent', color: activeTab === 'Activity' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 600, transition: 'all 0.2s', outline: 'none' }}
          >
            Recent Activity
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '1.5rem' }}>
          {activeTab === 'Permissions' ? (
            <div className="flex flex-col gap-4">
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {app.riskExplanation}
              </p>
              
              <div className="mt-4 flex flex-col gap-3">
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Data Access Permissions</h4>
                {app.permissions.map(p => (
                  <div key={p.id} className="flex items-center justify-between glass-card" style={{ padding: '1rem' }}>
                    <div>
                      <h5 style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.category}</h5>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{p.purpose}</p>
                    </div>
                    <button 
                      className={`glass-button cursor-pointer ${p.isGranted ? 'active' : ''}`}
                      onClick={() => updatePermission(app.id, p.id, !p.isGranted)}
                      disabled={!p.isOptional}
                      style={{ opacity: !p.isOptional ? 0.5 : 1, padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      {p.isGranted ? 'Allowed' : 'Blocked'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
               <div className="glass-card flex items-center gap-3">
                 <Activity size={18} className="text-secondary" />
                 <div>
                   <h5 style={{ fontWeight: 600, fontSize: '0.875rem' }}>{app.name} requested background location</h5>
                   <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>2 hours ago</p>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', background: 'var(--glass-bg)' }}>
          <button className="glass-button cursor-pointer danger w-full font-semibold flex items-center justify-center gap-2" onClick={handleRevoke}>
             <Trash2 size={18} /> Revoke App Access
          </button>
        </div>
        
      </div>
    </div>
  );
};
