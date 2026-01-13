import { api } from '@/lib/api/client';
import { setTokens } from '@/lib/auth/tokens';

function pickTokens(payload: any): { access?: string; refresh?: string } {
  return {
    access: payload?.accessToken ?? payload?.data?.accessToken,
    refresh: payload?.refreshToken ?? payload?.data?.refreshToken,
  };
}

export async function artistRegister(input: {
  email: string;
  password: string;
  name: string;
  type?: string;
}) {
  const res = await api.post('/api/artist/register', input);
  const { access, refresh } = pickTokens(res.data);
  if (access || refresh) await setTokens(access ?? null, refresh ?? null);
  return res.data;
}

export async function artistLogin(input: { email: string; password: string }) {
  const res = await api.post('/api/artist/login', input);
  const { access, refresh } = pickTokens(res.data);
  if (access || refresh) await setTokens(access ?? null, refresh ?? null);
  return res.data;
}

export async function artistVerifyOtp(email: string, otp: string) {
  const res = await api.post('/api/artist/verifyOtp', { email, otp });
  return res.data;
}

export async function artistResendOtp(email: string) {
  const res = await api.post('/api/artist/resendOtp', { email });
  return res.data;
}

export async function artistForgotPassword(email: string) {
  const res = await api.post('/api/artist/forgotPassword', { email });
  return res.data;
}

export async function artistResetPassword(email: string, otp: string, newPassword: string) {
  const res = await api.post('/api/artist/resetPassword', { email, otp, newPassword });
  return res.data;
}

export async function artistIsVerified(email: string) {
  const res = await api.get('/api/artist/isVerified', { params: { email } });
  return res.data;
}

export async function getMyArtistProfile() {
  const res = await api.get('/api/artist/profile/me');
  return res.data;
}

export async function getAllArtists() {
  const res = await api.get('/api/artist/getAllArtists');
  return res.data;
}

export async function getArtistById(artistId: string) {
  const res = await api.get(`/api/artist/getArtistById/${encodeURIComponent(artistId)}`);
  return res.data;
}

export async function getLikedArtists() {
  const res = await api.get('/api/artist/getLikedArtists');
  return res.data;
}

export async function getFollowedArtists() {
  const res = await api.get('/api/artist/getFollowedArtists');
  return res.data;
}

export async function followArtist(input: { artistId: string; userId: string }) {
  const res = await api.post('/api/artist/followArtist', input);
  return res.data;
}

export async function likeArtist(input: { artistId: string; userId: string }) {
  const res = await api.post('/api/artist/likeArtist', input);
  return res.data;
}

export async function getArtistDashboardStats() {
  const res = await api.get('/api/artist/dashboard/stats');
  return res.data;
}