import React, { useState } from 'react';
import { ConnectedApp } from '../../types';
import { MapPin, Users, Image as ImageIcon, Camera, Mic, HeartPulse, Database, Clock } from 'lucide-react';
import { AppDetailModal } from './AppDetailModal';
import { AppLogo } from './AppLogo';
import { getTrustScoreColor } from '../../utils/colors';

export const AppCard = ({ app }: { app: ConnectedApp }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Helper for Category Icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Location': return <MapPin size={14} />;
      case 'Contacts': return <Users size={14} />;
      case 'Photos': return <ImageIcon size={14} />;
      case 'Camera': return <Camera size={14} />;
      case 'Microphone': return <Mic size={14} />;
      case 'Health': return <HeartPulse size={14} />;
      default: return <Database size={14} />;
    }
  };

  const date = new Date(app.lastAccessed);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  return (
    <>
      <div className="glass-card flex flex-col h-full" onClick={() => setIsModalOpen(true)}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <AppLogo name={app.name} fallbackIcon={app.logoUrl} size={44} />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{app.name}</h3>
              <div className="flex items-center gap-1" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                <Clock size={12} />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-4 flex-1">
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accesses</p>
          <div className="flex flex-wrap gap-2">
            {app.dataCategories.map((cat, idx) => (
              <div key={idx} style={{ padding: '0.25rem 0.5rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-primary)' }}>
                {getCategoryIcon(cat)}
                {cat}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--glass-border)' }}>
          <div className={`badge-${app.riskLevel.toLowerCase()}`}>
            {app.riskLevel} Risk
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Score: <span style={{ color: getTrustScoreColor(app.trustScore) }}>{app.trustScore}</span>
          </div>
        </div>
      </div>

      {isModalOpen && <AppDetailModal app={app} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};
