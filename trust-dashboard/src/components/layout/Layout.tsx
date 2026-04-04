import React, { useState } from 'react';
import { Shield, LayoutDashboard, Grid, Activity, Bell, User, Settings, LogOut, ChevronDown, BarChart3, Camera, Mic, MapPin, HardDrive, Fingerprint, Smartphone, AlertTriangle, X, CheckCheck } from 'lucide-react';
import { useDashboard } from '../../data/DashboardContext';


export const Layout = ({ children, activeView, setActiveView, onLogout }: any) => {
  const { recommendations, metrics, user, activeAlerts, dismissAlert, markAllAlertsAsRead } = useDashboard();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const dropdownStyle: React.CSSProperties = {
    top: 'calc(100% + 1rem)',
    zIndex: 200,
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 12px 36px rgba(0,0,0,0.12), 0 0 0 1px rgba(226, 232, 240, 1)',
    borderRadius: '16px',
    color: '#0f172a'
  };

  return (
    <div className="flex" style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '280px', margin: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', flexShrink: 0, position: 'sticky', top: '1.5rem', height: 'calc(100vh - 3rem)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center text-white" style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--primary-accent)' }}>
            <Shield size={24} />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>HushhTrust</h1>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeView === 'Overview'} onClick={() => setActiveView('Overview')} />
          <NavItem icon={<Grid size={20} />} label="Connected Apps" active={activeView === 'Apps'} onClick={() => setActiveView('Apps')} />
          <NavItem icon={<BarChart3 size={20} />} label="Sensor Analytics" active={activeView === 'Insights'} onClick={() => setActiveView('Insights')} />
          <NavItem icon={<Activity size={20} />} label="Activity Logs" active={activeView === 'Logs'} onClick={() => setActiveView('Logs')} />
          <NavItem icon={<Bell size={20} />} label="Recommendations" badge={recommendations.length} active={activeView === 'Recommendations'} onClick={() => setActiveView('Recommendations')} />
        </nav>
        
        <div className="mt-auto">
          <div className="glass-card flex flex-col items-center" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <Shield size={28} style={{ color: 'var(--color-safe)', marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Privacy Assured</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Data stays on your device.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col flex-1" style={{ padding: '1.5rem 2rem 2rem 0' }}>
        <header className="flex justify-between items-center glass-panel" style={{ padding: '1rem 2rem', marginBottom: '2rem', height: '80px', flexShrink: 0, position: 'sticky', top: '1.5rem', zIndex: 100 }}>
          
          {/* Dim Overlay when any dropdown is open */}
          {(profileOpen || notificationsOpen) && (
            <div 
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.06)', backdropFilter: 'blur(2px)', zIndex: 150 }} 
              onClick={() => { setProfileOpen(false); setNotificationsOpen(false); }}
            />
          )}

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
              {activeView === 'Overview' && 'Welcome Back'}
              {activeView === 'Apps' && 'Connected Applications'}
              {activeView === 'Insights' && 'Hardware Analytics'}
              {activeView === 'Logs' && 'Data Activity Timeline'}
              {activeView === 'Recommendations' && 'Privacy Recommendations'}
              {(activeView === 'EditProfile' || activeView === 'PrivacySettings') && 'Account Security'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {activeView === 'Overview' && 'Here is your overall trust status and risk metrics.'}
              {activeView === 'Apps' && 'Manage granular permissions for all your apps.'}
              {activeView === 'Insights' && 'Review raw analytical frequency of global sensors.'}
              {activeView === 'Logs' && 'Review when and how your data was accessed.'}
              {activeView === 'Recommendations' && 'Actionable insights to secure your privacy.'}
              {(activeView === 'EditProfile' || activeView === 'PrivacySettings') && 'Manage your personal identity and configuration.'}
            </p>
          </div>
          
          <div className="flex items-center gap-6 relative" style={{ zIndex: 200 }}>
            {/* Notification Dropdown toggler */}
            <div className="relative">
              <button 
                className="glass-button" 
                style={{ padding: '0.625rem', borderRadius: '50%', color: 'var(--text-primary)' }} 
                onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
              >
                <Bell size={20} />
                {activeAlerts.filter(a => !a.read).length > 0 && (
                  <span className="absolute flex items-center justify-center font-bold" style={{ top: -6, right: -6, width: '20px', height: '20px', backgroundColor: 'var(--color-risky)', borderRadius: '50%', border: '2px solid white', color: 'white', fontSize: '10px' }}>
                    {activeAlerts.filter(a => !a.read).length}
                  </span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="absolute" style={{ ...dropdownStyle, right: '-4rem', width: '360px', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Notification Header */}
                  <div className="flex justify-between items-center px-5 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex items-center gap-2">
                       <h4 className="font-semibold" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Notifications</h4>
                       {activeAlerts.filter(a => !a.read).length > 0 && (
                          <span className="badge-risky" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>{activeAlerts.filter(a => !a.read).length} new</span>
                       )}
                    </div>
                    {activeAlerts.length > 0 && (
                      <button 
                        className="flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors" 
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary-accent)' }}
                        onClick={markAllAlertsAsRead}
                      >
                        <CheckCheck size={14} /> Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification Body Box */}
                  <div style={{ maxHeight: '420px', overflowY: 'auto' }} className="flex flex-col">
                    {activeAlerts.length > 0 ? (
                      activeAlerts.map(alert => {
                        
                        let borderColor = 'var(--glass-border)';
                        let iconColor = 'var(--text-secondary)';
                        
                        if (alert.riskLevel === 'Risky') {
                          borderColor = 'var(--color-risky)';
                          iconColor = 'var(--color-risky)';
                        } else if (alert.riskLevel === 'Moderate') {
                          borderColor = 'var(--color-moderate)';
                          iconColor = 'var(--color-moderate)';
                        } else {
                          borderColor = 'var(--color-safe)';
                          iconColor = 'var(--color-safe)';
                        }

                        const renderSensorIcon = () => {
                           switch(alert.sensorType) {
                            case 'Camera': return <Camera size={16} />;
                            case 'Microphone': return <Mic size={16} />;
                            case 'Location': return <MapPin size={16} />;
                            case 'Contacts': return <Fingerprint size={16} />;
                            case 'Storage': return <HardDrive size={16} />;
                            default: return <Smartphone size={16} />;
                           }
                        };

                        return (
                          <div 
                            key={alert.id} 
                            className="relative flex gap-3 pb-4 pt-4 px-5 transition-colors cursor-pointer hover:bg-slate-50" 
                            style={{ 
                              borderBottom: '1px solid rgba(0,0,0,0.04)', 
                              borderLeft: `3px solid ${borderColor}`,
                              background: !alert.read ? 'rgba(59, 130, 246, 0.02)' : 'transparent'
                            }}
                            onClick={() => { setActiveView('Logs'); setNotificationsOpen(false); }}
                          >
                            <div style={{ padding: '0.5rem', background: 'var(--glass-bg)', border: `1px solid ${borderColor}`, borderRadius: '50%', color: iconColor, marginTop: '2px', flexShrink: 0, height: '34px', width: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {alert.riskLevel === 'Risky' ? <AlertTriangle size={18} /> : renderSensorIcon()}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div className="flex justify-between items-start mb-1">
                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', paddingRight: '1rem' }}>
                                  {alert.appName} {alert.isBackground ? 'Background' : ''} Access
                                </p>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); dismissAlert(alert.id); }} 
                                  className="text-slate-400 hover:text-slate-600 transition-colors"
                                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.375rem' }}>
                                {alert.message}
                              </p>
                              <p style={{ fontSize: '0.6875rem', fontWeight: 500, color: 'var(--text-secondary)', opacity: 0.8 }}>
                                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <Bell size={32} style={{ color: 'var(--glass-border)', marginBottom: '1rem' }} />
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>You're all caught up!</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.7, marginTop: '0.25rem' }}>No recent hardware pings detected.</p>
                      </div>
                    )}
                  </div>

                  {/* Pre-footer View All Link */}
                  {activeAlerts.length > 0 && (
                    <div className="p-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.5)' }}>
                      <button 
                        className="w-full glass-button font-semibold justify-center py-2" 
                        style={{ fontSize: '0.8125rem' }} 
                        onClick={() => { setActiveView('Logs'); setNotificationsOpen(false); }}
                      >
                        View Full Activity Timeline
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ width: '1px', height: '32px', background: 'var(--glass-border)' }}></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button className="flex items-center gap-3 cursor-pointer" style={{ background: 'transparent', border: 'none', outline: 'none' }} onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                  {user.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase() || 'J'}
                </div>
                <div className="flex flex-col items-start" style={{ display: 'none' }}>
                   <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</span>
                   <span className="text-safe" style={{ fontSize: '0.75rem', fontWeight: 500 }}>Protected Account</span>
                </div>
                <ChevronDown size={16} className="text-secondary" />
              </button>

              {profileOpen && (
                <div className="absolute" style={{ ...dropdownStyle, right: 0, width: '300px' }}>
                  <div className="flex items-center gap-4 pb-5 mb-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', flexShrink: 0, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)', overflow: 'hidden' }}>
                      {user.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase() || 'J'}
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>{user.name}</h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mb-5 pb-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Account Status</span>
                      <span className="badge-safe py-1 px-2" style={{ padding: '0.25rem 0.625rem', lineHeight: 1 }}>Protected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Trust Score</span>
                      <span style={{ fontSize: '1rem', fontWeight: 700 }} className="text-safe">{metrics.overallTrustScore} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/ 100</span></span>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-2">
                    <button className="flex items-center gap-3 w-full" onClick={() => { setActiveView('EditProfile'); setProfileOpen(false); }} style={{ padding: '0.875rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: '8px', transition: 'background 0.2s', color: 'var(--text-primary)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <User size={18} className="text-secondary" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Edit Profile</span>
                    </button>
                    <button className="flex items-center gap-3 w-full" onClick={() => { setActiveView('PrivacySettings'); setProfileOpen(false); }} style={{ padding: '0.875rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: '8px', transition: 'background 0.2s', color: 'var(--text-primary)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <Settings size={18} className="text-secondary" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Privacy Settings</span>
                    </button>
                    <button className="flex items-center gap-3 w-full" onClick={() => { if(onLogout) onLogout(); else window.location.reload(); }} style={{ padding: '0.875rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: '8px', transition: 'background 0.2s', marginTop: '0.5rem' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.08)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <LogOut size={18} className="text-risky" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }} className="text-risky">Secure Logout</span>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <div className="flex-1 w-full max-w-[1200px]">
          {children}
        </div>
      </main>
      
      {/* Global Real-Time Event Toaster HUD */}

    </div>
  );
};

const NavItem = ({ icon, label, active, badge, onClick }: any) => {
  return (
    <button onClick={onClick} className={`glass-button w-full ${active ? 'active' : ''}`} style={{ justifyContent: 'flex-start', border: active ? '1px solid transparent' : undefined, padding: '0.875rem 1rem', background: active ? 'var(--primary-accent)' : undefined, color: active ? 'white' : undefined }}>
      <div className="flex items-center gap-3 w-full">
        <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
        <span style={{flex: 1, textAlign: 'left', fontWeight: active ? 600 : 500}}>{label}</span>
        {badge ? (
          <span className="badge-risky" style={{ padding: '2px 8px', fontSize: '0.75rem', minWidth: '24px', justifyContent: 'center' }}>
            {badge}
          </span>
        ) : null}
      </div>
    </button>
  );
};
