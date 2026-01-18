import { api } from '@/lib/api/client';
import { clearTokens, setAuthEmail, setTokens } from '@/lib/auth/tokens';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

function pickTokens(payload: any): { access?: string; refresh?: string } {
  return {
    access: payload?.accessToken ?? payload?.data?.accessToken,
    refresh: payload?.refreshToken ?? payload?.data?.refreshToken,
  };
}

function getErrorMessage(error: any, fallback = 'Something went wrong') {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export async function register(input: {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}) {
  try {
    const res = await api.post('/api/user/register', input);
    const { access, refresh } = pickTokens(res.data);
    if (access || refresh) await setTokens(access ?? null, refresh ?? null);
    await setAuthEmail(input.email);
    showSuccessToast('Sign up successful', res.data?.message || 'Account created.');
    return res.data;
  } catch (error: any) {
    showErrorToast('Sign up failed', getErrorMessage(error, 'Unable to create account.'));
    throw error;
  }
}

export async function login(input: { email: string; password: string }) {
  try {
    const res = await api.post('/api/user/login', input);
    const { access, refresh } = pickTokens(res.data);
    if (access || refresh) await setTokens(access ?? null, refresh ?? null);
    await setAuthEmail(input.email);
    showSuccessToast('Signed in', res.data?.message || 'Welcome back.');
    return res.data;
  } catch (error: any) {
    showErrorToast('Login failed', getErrorMessage(error, 'Please check your credentials.'));
    throw error;
  }
}

export async function verifyOtp(email: string, otp: string) {
  try {
    const res = await api.post('/api/user/verifyOtp', { email, otp });
    showSuccessToast('OTP verified', res.data?.message || 'Verification successful.');
    return res.data;
  } catch (error: any) {
    showErrorToast('Verification failed', getErrorMessage(error, 'OTP verification failed.'));
    throw error;
  }
}

export async function resendOtp(email: string) {
  try {
    const res = await api.post('/api/user/resendOtp', { email });
    showSuccessToast('OTP resent', res.data?.message || 'Check your email.');
    return res.data;
  } catch (error: any) {
    showErrorToast('Resend failed', getErrorMessage(error, 'Unable to resend OTP.'));
    throw error;
  }
}

export async function forgotPassword(email: string) {
  try {
    const res = await api.post('/api/user/forgotPassword', { email });
    await setAuthEmail(email);
    showSuccessToast('OTP sent', res.data?.message || 'Check your email for reset OTP.');
    return res.data;
  } catch (error: any) {
    showErrorToast('Request failed', getErrorMessage(error, 'Unable to send reset OTP.'));
    throw error;
  }
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  try {
    const res = await api.post('/api/user/resetPassword', { email, otp, newPassword });
    showSuccessToast('Password reset', res.data?.message || 'You can sign in now.');
    return res.data;
  } catch (error: any) {
    showErrorToast('Reset failed', getErrorMessage(error, 'Unable to reset password.'));
    throw error;
  }
}

export async function isVerified(email: string) {
  try {
    const res = await api.get('/api/user/isVerified', { params: { email } });
    showSuccessToast('Verification status', res.data?.message || 'Status checked.');
    return res.data;
  } catch (error: any) {
    showErrorToast('Status failed', getErrorMessage(error, 'Unable to check verification status.'));
    throw error;
  }
}

export async function logout() {
  try {
    const res = await api.post('/api/user/logout');
    showSuccessToast('Signed out', res.data?.message || 'You have been signed out.');
    return res.data;
  } catch (error: any) {
    showErrorToast('Sign out failed', getErrorMessage(error, 'Unable to sign out.'));
    throw error;
  } finally {
    await clearTokens();
  }
}