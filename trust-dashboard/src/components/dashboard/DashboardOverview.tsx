import React from 'react';
import { useDashboard } from '../../data/DashboardContext';
import { Grid, Eye, AlertTriangle } from 'lucide-react';

export const DashboardOverview = () => {
  const { metrics } = useDashboard();

  return (
    <div className="grid-12 h-full">
      <div className="col-span-4 lg:col-span-12 h-full">
        <MetricCard 
          title="Connected Apps" 
          value={metrics.totalApps.toString()} 
          icon={<Grid size={24} style={{ color: 'var(--primary-accent)' }} />} 
          description="Total apps with any data access"
        />
      </div>
      
      <div className="col-span-4 lg:col-span-12 h-full">
        <MetricCard 
          title="Data Points Shared" 
          value={metrics.totalDataPointsShared.toString()} 
          icon={<Eye size={24} className="text-moderate" />} 
          description="Across all categories"
        />
      </div>
      
      <div className="col-span-4 lg:col-span-12 h-full">
        <div className="glass-panel flex flex-col justify-between h-full" style={{ padding: '1.5rem 1.5rem 2rem' }}>
          <div className="flex justify-between items-start mb-4">
            <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Risk Summary</h4>
            <div style={{ background: 'var(--color-risky-light)', padding: '0.625rem', borderRadius: '12px' }}>
              <AlertTriangle size={20} className="text-risky" />
            </div>
          </div>
          
          <div className="flex flex-col gap-3 mt-auto">
            <RiskBar label="Safe" count={metrics.safeApps} total={metrics.totalApps} color="var(--color-safe)" />
            <RiskBar label="Moderate" count={metrics.moderateApps} total={metrics.totalApps} color="var(--color-moderate)" />
            <RiskBar label="Risky" count={metrics.riskyApps} total={metrics.totalApps} color="var(--color-risky)" />
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, description }: any) => (
  <div className="glass-panel flex flex-col justify-between h-full" style={{ padding: '1.5rem 1.5rem 2rem' }}>
    <div className="flex justify-between items-start mb-4">
      <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</h4>
      <div style={{ background: 'var(--glass-bg)', padding: '0.625rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        {icon}
      </div>
    </div>
    <div className="mt-auto">
      <div style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{value}</div>
      <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  </div>
);

const RiskBar = ({ label, count, total, color }: any) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div className="flex items-center gap-3">
      <span style={{ fontSize: '0.875rem', width: '64px', fontWeight: 500 }}>{label}</span>
      <div style={{ flex: 1, height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${percentage}%`, background: color, borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
      </div>
      <span style={{ fontSize: '0.875rem', fontWeight: 600, width: '24px', textAlign: 'right' }}>{count}</span>
    </div>
  );
}
