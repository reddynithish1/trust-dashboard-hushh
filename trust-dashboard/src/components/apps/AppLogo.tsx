import React, { useState } from 'react';
import * as Icons from 'lucide-react';

const DOMAIN_MAP: Record<string, string> = {
  'Google Chrome': 'google.com',
  'Spotify': 'spotify.com',
  'Instagram': 'instagram.com',
  'Snapchat': 'snapchat.com',
  'WhatsApp': 'whatsapp.com',
  'Amazon': 'amazon.com',
  'YouTube': 'youtube.com',
  'Google Maps': 'maps.google.com',
  'Uber': 'uber.com',
  'Netflix': 'netflix.com'
};

export const AppLogo = ({ name, fallbackIcon = 'Box', size = 44 }: { name: string, fallbackIcon?: string, size?: number }) => {
  const [error, setError] = useState(false);
  const domain = DOMAIN_MAP[name];

  if (!domain || error) {
    const Fallback = (Icons as any)[fallbackIcon] || Icons.Box;
    return (
      <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)', flexShrink: 0 }}>
        <Fallback size={size * 0.5} className="text-secondary" />
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
      <img 
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} 
        alt={`${name} logo`}
        style={{ width: '65%', height: '65%', objectFit: 'contain' }}
        onError={() => setError(true)}
      />
    </div>
  );
};
