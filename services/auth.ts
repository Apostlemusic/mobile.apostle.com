import { api } from '@/lib/api/client';
import { clearTokens, setAuthEmail, setTokens } from '@/lib/auth/tokens';

function pickTokens(payload: any): { access?: string; refresh?: string } {
  return {
    access: payload?.accessToken ?? payload?.data?.accessToken,
    refresh: payload?.refreshToken ?? payload?.data?.refreshToken,
  };
}

export async function register(input: {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}) {
  const res = await api.post('/api/auth/register', input);
  const { access, refresh } = pickTokens(res.data);
  if (access || refresh) await setTokens(access ?? null, refresh ?? null);
  await setAuthEmail(input.email);
  return res.data;
}

export async function login(input: { email: string; password: string }) {
  const res = await api.post('/api/auth/login', input);
  const { access, refresh } = pickTokens(res.data);
  if (access || refresh) await setTokens(access ?? null, refresh ?? null);
  await setAuthEmail(input.email);
  return res.data;
}

export async function verifyOtp(email: string, otp: string) {
  const res = await api.post('/api/auth/verifyOtp', { email, otp });
  return res.data;
}

export async function resendOtp(email: string) {
  const res = await api.post('/api/auth/resendOtp', { email });
  return res.data;
}

export async function forgotPassword(email: string) {
  const res = await api.post('/api/auth/forgotPassword', { email });
  await setAuthEmail(email);
  return res.data;
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  const res = await api.post('/api/auth/resetPassword', { email, otp, newPassword });
  return res.data;
}

export async function isVerified(email: string) {
  const res = await api.get('/api/auth/isVerified', { params: { email } });
  return res.data;
}

export async function logout() {
  try {
    const res = await api.post('/api/auth/logout');
    return res.data;
  } finally {
    await clearTokens();
  }
}