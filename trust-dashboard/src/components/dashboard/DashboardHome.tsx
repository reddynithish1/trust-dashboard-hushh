import React from 'react';
import { TrustScoreWidget } from './TrustScoreWidget';
import { DashboardOverview } from './DashboardOverview';
import { AlertSystem } from './AlertSystem';
import { AppGrid } from '../apps/AppGrid';

export const DashboardHome = ({ setActiveView }: any) => {
  return (
    <div className="flex flex-col gap-8 w-full" style={{ paddingBottom: '2rem' }}>
      
      <div className="grid-12 w-full items-stretch h-56">
        <div className="col-span-4 lg:col-span-12 h-full">
          <TrustScoreWidget />
        </div>
        <div className="col-span-8 lg:col-span-12 h-full">
          <DashboardOverview />
        </div>
      </div>
      
      <div className="grid-12 w-full gap-8 mt-4">
        <div className="col-span-8 lg:col-span-12 flex flex-col gap-6">
          <AppGrid showFilters={true} />
        </div>
        <div className="col-span-4 lg:col-span-12">
          <div className="flex justify-between items-center mb-6">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Active Alerts</h3>
            <button className="text-primary cursor-pointer font-semibold text-sm" style={{ background: 'transparent', border: 'none', color: 'var(--primary-accent)' }} onClick={() => setActiveView('Recommendations')}>View All</button>
          </div>
          <AlertSystem />
        </div>
      </div>

    </div>
  );
};
