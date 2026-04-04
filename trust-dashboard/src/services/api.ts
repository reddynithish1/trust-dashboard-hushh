const BASE_URL = 'http://localhost:5005/api';

const getToken = (): string | null => localStorage.getItem('hushhtrust_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'API Error');
  }
  return res.json();
};

// ─── Local Demo Credentials (fallback when backend/MongoDB is unavailable) ──
const DEMO_USERS = [
  { _id: 'demo-user-a', name: 'User A', email: 'usera@example.com', password: 'password123', avatar: 'Box' },
  { _id: 'demo-user-b', name: 'User B', email: 'userb@example.com', password: 'password123', avatar: 'Box' },
];

const generateMockToken = (userId: string) =>
  `mock-jwt-${userId}-${Date.now()}`;

const localLogin = (email: string, password: string) => {
  const user = DEMO_USERS.find(
    (u) => u.email === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error('Invalid email or password');
  return { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, token: generateMockToken(user._id) };
};

const localRegister = (name: string, email: string, _password: string) => {
  const id = `local-${Date.now()}`;
  return { _id: id, name, email, avatar: 'Box', token: generateMockToken(id) };
};

// ─── Auth ──────────────────────────────────────────────────────────────────
export const loginApi = async (email: string, password: string) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await handleResponse(res);
  } catch (err: any) {
    // Network error → backend unreachable, use local fallback
    if (err.message === 'Failed to fetch' || err.message?.includes('NetworkError')) {
      console.warn('Backend unreachable — using local demo authentication');
      return localLogin(email, password);
    }
    throw err;
  }
};

export const registerApi = async (name: string, email: string, password: string) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return await handleResponse(res);
  } catch (err: any) {
    if (err.message === 'Failed to fetch' || err.message?.includes('NetworkError')) {
      console.warn('Backend unreachable — using local demo registration');
      return localRegister(name, email, password);
    }
    throw err;
  }
};

// ─── Profile ───────────────────────────────────────────────────────────────
export const fetchProfile = () =>
  fetch(`${BASE_URL}/profile`, { headers: authHeaders() }).then(handleResponse);

export const updateProfileApi = (data: { name: string; email: string }) =>
  fetch(`${BASE_URL}/profile`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

// ─── Apps ──────────────────────────────────────────────────────────────────
export const fetchApps = () =>
  fetch(`${BASE_URL}/apps`, { headers: authHeaders() }).then(handleResponse);

export const revokeAppApi = (appId: string) =>
  fetch(`${BASE_URL}/apps/${appId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(handleResponse);

export const updatePermissionApi = (appId: string, permissionId: string, isGranted: boolean) =>
  fetch(`${BASE_URL}/apps/${appId}/permissions`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ permissionId, isGranted }),
  }).then(handleResponse);

// ─── Activity ──────────────────────────────────────────────────────────────
export const fetchActivity = () =>
  fetch(`${BASE_URL}/activity`, { headers: authHeaders() }).then(handleResponse);

// ─── Alerts ────────────────────────────────────────────────────────────────
export const fetchAlerts = () =>
  fetch(`${BASE_URL}/alerts`, { headers: authHeaders() }).then(handleResponse);

// ─── Insights ──────────────────────────────────────────────────────────────
export const fetchInsights = () =>
  fetch(`${BASE_URL}/insights`, { headers: authHeaders() }).then(handleResponse);
