import React, { useState } from 'react';
import { useDashboard } from '../../data/DashboardContext';
import { AppCard } from './AppCard';

export const AppGrid = ({ showFilters = false }: { showFilters?: boolean }) => {
  const { apps } = useDashboard();
  const [filter, setFilter] = useState<'All' | 'Risky' | 'Unused'>('All');

  const filteredApps = apps.filter(app => {
    if (filter === 'Risky') return app.riskLevel === 'Risky';
    if (filter === 'Unused') return app.usageFrequency === 'Unused';
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {showFilters && (
        <div className="flex justify-between items-center mb-2">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{filter === 'All' ? 'All Connected Apps' : `${filter} Apps`}</h3>
          <div className="glass-panel" style={{ padding: '0.25rem', display: 'flex', borderRadius: 'var(--border-radius-sm)', gap: '0.25rem' }}>
            <button 
              onClick={() => setFilter('All')}
              className="cursor-pointer font-semibold"
              style={{ padding: '0.375rem 1rem', fontSize: '0.875rem', borderRadius: '6px', border: filter === 'All' ? '1px solid transparent' : 'none', background: filter === 'All' ? 'var(--primary-accent)' : 'transparent', color: filter === 'All' ? 'white' : 'var(--text-primary)', transition: 'all 0.2s', outline: 'none' }}>
              All
            </button>
            <button 
              onClick={() => setFilter('Risky')}
              className="cursor-pointer font-semibold"
              style={{ padding: '0.375rem 1rem', fontSize: '0.875rem', borderRadius: '6px', border: filter === 'Risky' ? '1px solid transparent' : 'none', background: filter === 'Risky' ? 'var(--primary-accent)' : 'transparent', color: filter === 'Risky' ? 'white' : 'var(--text-primary)', transition: 'all 0.2s', outline: 'none' }}>
              Risky
            </button>
            <button 
              onClick={() => setFilter('Unused')}
              className="cursor-pointer font-semibold"
              style={{ padding: '0.375rem 1rem', fontSize: '0.875rem', borderRadius: '6px', border: filter === 'Unused' ? '1px solid transparent' : 'none', background: filter === 'Unused' ? 'var(--primary-accent)' : 'transparent', color: filter === 'Unused' ? 'white' : 'var(--text-primary)', transition: 'all 0.2s', outline: 'none' }}>
              Unused
            </button>
          </div>
        </div>
      )}

      {filteredApps.length === 0 ? (
        <div className="glass-panel text-center w-full" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
          No {filter.toLowerCase()} apps found matching this criteria.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredApps.map(app => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
};
