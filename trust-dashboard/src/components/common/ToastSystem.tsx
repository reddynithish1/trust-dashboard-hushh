import React from 'react';
import { AlertTriangle, Fingerprint, Camera, Mic, MapPin, X, HardDrive, Smartphone } from 'lucide-react';
import { useDashboard } from '../../data/DashboardContext';
import { SensorEvent } from '../../types';

export const ToastSystem = () => {
  const { activeAlerts, dismissAlert } = useDashboard();

  if (activeAlerts.length === 0) return null;

  const renderIcon = (sensor: SensorEvent['sensorType']) => {
    switch (sensor) {
      case 'Camera': return <Camera size={16} />;
      case 'Microphone': return <Mic size={16} />;
      case 'Location': return <MapPin size={16} />;
      case 'Contacts': return <Fingerprint size={16} />;
      case 'Storage': return <HardDrive size={16} />;
      default: return <Smartphone size={16} />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm">
      {activeAlerts.slice(0, 3).map(alert => (
        <div 
          key={alert.id} 
          className={`flex overflow-hidden transform transition-all duration-300 animate-slide-up shadow-2xl rounded-2xl border ${alert.riskLevel === 'Risky' ? 'bg-[rgba(255,77,79,0.95)] border-red-500' : 'bg-[rgba(255,193,7,0.95)] border-yellow-500'}`}
          style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', color: alert.riskLevel === 'Risky' ? 'white' : '#452a04' }}
        >
          <div className="flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.1)' }}>
            <AlertTriangle size={24} color={alert.riskLevel === 'Risky' ? 'white' : '#b45309'} />
          </div>
          <div className="flex-1 py-3 px-4">
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.125rem' }}>
              {alert.appName} {alert.isBackground && '• Background'} {alert.count && alert.count > 1 ? `(${alert.count})` : ''}
            </h4>
            <p style={{ fontSize: '0.8125rem', opacity: 0.9, lineHeight: 1.3 }}>
              {alert.message}
            </p>
            <div className="flex items-center gap-1 mt-2 font-medium" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
              {renderIcon(alert.sensorType)} Accessed
            </div>
          </div>
          <button 
            type="button" 
            className="px-4 hover:bg-[rgba(0,0,0,0.1)] transition-colors cursor-pointer" 
            onClick={() => dismissAlert(alert.id)}
          >
            <X size={18} />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slide-up {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
