import React from 'react';
import { useDashboard } from '../../data/DashboardContext';
import { AlertCircle, Trash2, Shield, X, Info } from 'lucide-react';

export const AlertSystem = () => {
  const { recommendations, dismissRecommendation } = useDashboard();

  if (recommendations.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <Shield size={32} className="text-safe" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>No Active Alerts</h3>
        <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Your data sharing looks extremely safe.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recommendations</h3>
      <div className="flex flex-col gap-3">
        {recommendations.map(rec => (
          <div key={rec.id} className="glass-panel flex justify-between items-start" style={{ padding: '1.25rem' }}>
            <div className="flex gap-3 items-start">
              <div style={{ marginTop: '0.125rem', padding: '0.5rem', background: 'var(--glass-bg)', borderRadius: '12px' }}>
                {rec.type === 'Remove' && <Trash2 size={20} className="text-risky" />}
                {rec.type === 'Limit' && <AlertCircle size={20} className="text-moderate" />}
                {rec.type === 'Review' && <Info size={20} className="text-primary" />}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{rec.title}</h4>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', lineHeight: 1.5 }}>{rec.description}</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <button className={`glass-button ${rec.type === 'Remove' ? 'danger' : 'primary'}`} style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem' }}>
                    {rec.type === 'Remove' ? 'Revoke App' : 'Take Action'}
                  </button>
                </div>
              </div>
            </div>
            <button 
              className="glass-button"
              style={{ padding: '0.25rem', border: 'none', background: 'transparent', boxShadow: 'none' }} 
              onClick={() => dismissRecommendation(rec.id)}
            >
              <X size={16} className="text-secondary" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
