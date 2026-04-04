import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Camera, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useDashboard } from '../../data/DashboardContext';

export const EditProfile = () => {
  const { user, updateUser } = useDashboard();
  
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl);
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Keep internal state synched if global changes externally
    setName(user.name);
    setEmail(user.email);
    setAvatarUrl(user.avatarUrl);
  }, [user]);

  const validate = () => {
    if (!name.trim()) return 'Full Name cannot be empty.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please provide a valid email format.';
    return '';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      setSuccess(false);
      return;
    }
    
    setErrorMsg('');
    setIsLoading(true);
    setSuccess(false);
    
    try {
      // Broadcast valid user state through asynchronous context mutation
      await updateUser({ name, email, avatarUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setErrorMsg('Failed to update profile locally.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setAvatarUrl(user.avatarUrl);
    setErrorMsg('');
    setSuccess(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Edit Profile</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Manage your personal details and HushhTrust identity globally.</p>
      </div>
      
      <div className="glass-panel w-full" style={{ padding: '2rem' }}>
        <div className="flex items-center gap-6 mb-8">
          <div className="relative" style={{ width: 80, height: 80 }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--primary-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '2rem', overflow: 'hidden' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                name.charAt(0).toUpperCase() || 'J'
              )}
            </div>
            <button 
              type="button"
              className="absolute cursor-pointer" 
              style={{ bottom: 0, right: -4, background: '#fff', borderRadius: '50%', padding: '0.375rem', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={16} color="var(--text-primary)" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{name || 'Your Name'}</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Protected Account</p>
          </div>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSave}>
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 text-secondary" size={18} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => { setName(e.target.value); setErrorMsg(''); }}
                className="w-full" 
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', outline: 'none', borderRadius: '12px', textAlign: 'left', padding: '0.875rem 1rem 0.875rem 3rem', cursor: 'text', fontSize: '1rem', color: 'var(--text-primary)', transition: 'border-color 0.2s', borderColor: (errorMsg && !name.trim()) ? 'var(--risky)' : 'var(--glass-border)' }} 
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-accent)'}
                onBlur={(e) => e.currentTarget.style.borderColor = (errorMsg && !name.trim()) ? 'var(--risky)' : 'var(--glass-border)'}
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-secondary" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                className="w-full" 
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', outline: 'none', borderRadius: '12px', textAlign: 'left', padding: '0.875rem 1rem 0.875rem 3rem', cursor: 'text', fontSize: '1rem', color: 'var(--text-primary)', transition: 'border-color 0.2s', borderColor: (errorMsg && errorMsg.includes('email')) ? 'var(--risky)' : 'var(--glass-border)' }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-accent)'}
                onBlur={(e) => e.currentTarget.style.borderColor = (errorMsg && errorMsg.includes('email')) ? 'var(--risky)' : 'var(--glass-border)'}
              />
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-risky" style={{ background: 'rgba(255, 77, 79, 0.1)', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500 }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 text-safe" style={{ background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500 }}>
              <CheckCircle2 size={16} />
              <span>Profile updated successfully across HushhTrust!</span>
            </div>
          )}

          <div className="mt-2 flex gap-4 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
            <button 
              type="submit" 
              disabled={isLoading}
              className="glass-button primary cursor-pointer flex items-center gap-2 justify-center" 
              style={{ padding: '0.75rem 1.5rem', fontWeight: 600, minWidth: '160px', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
            </button>
            <button 
              type="button" 
              disabled={isLoading}
              className="glass-button cursor-pointer" 
              style={{ padding: '0.75rem 1.5rem', fontWeight: 600, opacity: isLoading ? 0.7 : 1 }} 
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
