import React, { useState } from 'react';
import { Shield, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { loginApi } from '../../services/api';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');

  const validate = () => {
    if (isSignUp && !name.trim()) return 'Please enter your full name.';
    if (!email.trim() || !password.trim()) return 'Please enter both email and password.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setErrorMsg(err); return; }

    setErrorMsg('');
    setIsLoading(true);

    try {
      let data;
      if (isSignUp) {
        // Import lazily to keep bundle lean
        const { registerApi } = await import('../../services/api');
        data = await registerApi(name.trim(), email.trim(), password);
      } else {
        data = await loginApi(email.trim(), password);
      }

      // Store JWT and user info for the session
      localStorage.setItem('hushhtrust_token', data.token);
      localStorage.setItem('hushhtrust_session', 'active');
      localStorage.setItem('hushhtrust_user', JSON.stringify({
        id: data._id,
        name: data.name,
        email: data.email,
        avatar: data.avatar ?? null,
      }));

      onLoginSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full relative" style={{ background: 'var(--bg-color)', overflow: 'hidden' }}>
      {/* Background Ambience */}
      <div className="absolute rounded-full" style={{ width: 500, height: 500, background: 'rgba(59, 130, 246, 0.08)', filter: 'blur(100px)', top: '-10%', right: '-10%' }} />
      <div className="absolute rounded-full" style={{ width: 400, height: 400, background: 'rgba(34, 197, 94, 0.08)', filter: 'blur(100px)', bottom: '-10%', left: '-5%' }} />

      <div className="glass-panel w-full" style={{ maxWidth: '440px', padding: '3.5rem 2.5rem', zIndex: 10, margin: '1.5rem' }}>
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'var(--primary-accent)', color: 'white', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)' }}>
            <Shield size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>HushhTrust</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: 500 }}>
            {isSignUp ? 'Create your private identity.' : 'Take control of your data.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrorMsg(''); }}
                className="w-full"
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', outline: 'none', borderRadius: '12px', padding: '0.875rem 1rem', fontSize: '1rem', color: 'var(--text-primary)' }}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-secondary" size={18} />
              <input
                type="email"
                placeholder="hello@hushhtrust.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                className="w-full"
                autoComplete="email"
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', outline: 'none', borderRadius: '12px', padding: '0.875rem 1rem 0.875rem 3rem', fontSize: '1rem', color: 'var(--text-primary)', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-accent)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
              {!isSignUp && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-accent)' }}>Forgot?</span>}
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-secondary" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                className="w-full"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', outline: 'none', borderRadius: '12px', padding: '0.875rem 1rem 0.875rem 3rem', fontSize: '1rem', color: 'var(--text-primary)', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-accent)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
              />
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3" style={{ background: 'rgba(255, 77, 79, 0.1)', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-risky)' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="glass-button primary w-full flex items-center justify-center cursor-pointer mt-2"
            style={{ padding: '0.875rem', fontWeight: 600, fontSize: '1rem', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? 'Create Account' : 'Secure Login')}
          </button>
        </form>

        {/* Demo credentials hint */}
        {!isSignUp && (
          <div className="mt-4 p-3 text-center" style={{ background: 'rgba(59,130,246,0.07)', borderRadius: '10px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Demo: <strong>usera@example.com</strong> / <strong>password123</strong>
          </div>
        )}

        <div className="mt-6 text-center pt-5" style={{ borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span
              className="cursor-pointer"
              style={{ color: 'var(--primary-accent)', fontWeight: 600 }}
              onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            >
              {isSignUp ? 'Sign In' : 'Create Identity'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
