import React from 'react';
import { useDashboard } from '../../data/DashboardContext';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { getTrustScoreColor } from '../../utils/colors';

export const TrustScoreWidget = () => {
  const { metrics } = useDashboard();
  const score = metrics.overallTrustScore;

  let ColorIcon = Shield;
  let statusText = 'Excellent';

  if (score <= 30) {
    ColorIcon = ShieldAlert;
    statusText = 'Risky';
  } else if (score <= 70) {
    ColorIcon = ShieldCheck;
    statusText = 'Moderate';
  } else {
    ColorIcon = ShieldCheck;
    statusText = 'Safe';
  }

  const dynamicColor = getTrustScoreColor(score);
  const rgbaTint = dynamicColor.replace('rgb', 'rgba').replace(')', ', 0.15)');

  // Circular progress math
  const strokeWidth = 14;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-panel flex flex-col h-full" style={{ padding: '2rem 1.5rem', justifyContent: 'center', textAlign: 'center' }}>
      
      <div className="flex justify-center mb-6">
        <div className="circle-progress-container" style={{ width: '160px', height: '160px' }}>
          <svg className="circle-progress-svg" style={{ width: '100%', height: '100%' }}>
            <circle 
              cx="80" cy="80" r={radius} 
              fill="transparent" 
              stroke="var(--glass-border)" 
              strokeWidth={strokeWidth} 
            />
            <circle 
              cx="80" cy="80" r={radius} 
              fill="transparent" 
              stroke={dynamicColor} 
              strokeWidth={strokeWidth} 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 1s ease-out' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center w-full h-full" style={{ top: 0, left: 0 }}>
            <span style={{ fontSize: '3.25rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.05em', color: dynamicColor, transition: 'color 1s ease-out' }}>{score}</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.25rem' }}>/ 100</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 1rem', borderRadius: '12px', background: rgbaTint, color: dynamicColor, fontWeight: 700, fontSize: '0.875rem', transition: 'all 1s ease-out' }} className="mb-2">
          <ColorIcon size={16} strokeWidth={2.5} />
          <span>{statusText}</span>
        </div>
        <h3 style={{ fontSize: '1.25rem' }}>Overall Trust Score</h3>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          Calculated dynamically based on {metrics.totalApps} connected apps and active risk factors.
        </p>
      </div>
      
    </div>
  );
};
