import React from 'react';
import { useDashboard } from '../../data/DashboardContext';

export const ActivityTimeline = () => {
  const { activities, sensorEvents } = useDashboard();

  // Aggregate and dynamically reverse-chronologically sort independent event streams
  const allEvents = [
    ...activities.map(a => ({ ...a, eventType: 'activity' as const })),
    ...sensorEvents.map(s => ({ ...s, eventType: 'sensor' as const }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Data Activity Logs</h2>
      <p style={{ color: 'var(--text-secondary)', marginTop: '-0.5rem' }}>Chronological timeline of system permissions and raw hardware sensor pings.</p>
      
      <div className="glass-panel flex flex-col" style={{ padding: '2rem' }}>
        {allEvents.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No activity logs found.</p>
        ) : (
          <div className="flex flex-col gap-8" style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--glass-border)' }}>
            {allEvents.map((item: any) => {
              const date = new Date(item.timestamp);
              const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const formattedDate = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
              
              const isSensor = item.eventType === 'sensor';
              
              let actionColor = 'var(--primary-accent)';
              let tagText = item.action || 'Access';
              
              if (!isSensor) {
                if (item.action === 'Requested') actionColor = 'var(--color-moderate)';
                if (item.action === 'Revoked') actionColor = 'var(--color-safe)';
              } else {
                if (item.riskLevel === 'Risky') actionColor = 'var(--color-risky)';
                if (item.riskLevel === 'Moderate') actionColor = 'var(--color-moderate)';
                tagText = item.isBackground ? 'Background' : 'Hardware Ping';
              }

              return (
                <div key={item.id} className="relative">
                  <div style={{ position: 'absolute', left: '-1.85rem', top: '0.35rem', width: '12px', height: '12px', background: actionColor, borderRadius: '50%', border: '2px solid white' }}></div>
                  <div className="flex justify-between items-start glass-card" style={{ padding: '1rem 1.5rem', margin: 0, border: isSensor && item.riskLevel === 'Risky' ? '1px solid rgba(255, 77, 79, 0.3)' : undefined }}>
                    <div>
                      {isSensor ? (
                        <p style={{ fontSize: '1rem', fontWeight: 600 }}>
                          {item.appName} <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>pinged your</span> {item.sensorType}
                        </p>
                      ) : (
                        <p style={{ fontSize: '1rem', fontWeight: 600 }}>
                          {item.appName} <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>{item.action.toLowerCase()}</span> {item.category}
                        </p>
                      )}
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {formattedDate} at {formattedTime} {isSensor && item.riskLevel === 'Risky' && <span className="text-risky font-semibold ml-2">• High Risk Isolation</span>}
                      </p>
                    </div>
                    <div style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', background: isSensor && item.riskLevel === 'Risky' ? 'rgba(255, 77, 79, 0.1)' : 'var(--glass-bg)', color: isSensor && item.riskLevel === 'Risky' ? 'var(--text-risky)' : 'inherit', border: '1px solid var(--glass-border)', borderRadius: '6px', fontWeight: 600 }}>
                       {tagText}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
