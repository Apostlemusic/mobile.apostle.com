import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_KEY = 'apostle.accessToken';
const REFRESH_KEY = 'apostle.refreshToken';
const EMAIL_KEY = 'apostle.authEmail'; // used to carry email across OTP flows
const EXPIRY_KEY = 'apostle.tokenExpiry';
const AUTH_INVALID_KEY = 'apostle.authInvalid';
const TOKEN_TTL_MS = (6 * 24 + 20) * 60 * 60 * 1000; // 6 days, 20 hours

export async function getAccessToken() {
  return AsyncStorage.getItem(ACCESS_KEY);
}

export async function getRefreshToken() {
  return AsyncStorage.getItem(REFRESH_KEY);
}

export async function setTokens(access?: string | null, refresh?: string | null) {
  if (access === null) await AsyncStorage.removeItem(ACCESS_KEY);
  else if (typeof access === 'string') {
    await AsyncStorage.setItem(ACCESS_KEY, access);
    await AsyncStorage.setItem(EXPIRY_KEY, String(Date.now() + TOKEN_TTL_MS));
  }

  if (refresh === null) await AsyncStorage.removeItem(REFRESH_KEY);
  else if (typeof refresh === 'string') await AsyncStorage.setItem(REFRESH_KEY, refresh);
}

export async function clearTokens() {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY, EXPIRY_KEY]);
}

export async function getTokenExpiry() {
  const raw = await AsyncStorage.getItem(EXPIRY_KEY);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export async function isTokenExpired() {
  const expiry = await getTokenExpiry();
  if (!expiry) return false;
  return Date.now() > expiry;
}

export async function setAuthInvalid(value: boolean) {
  if (!value) {
    await AsyncStorage.removeItem(AUTH_INVALID_KEY);
    return;
  }
  await AsyncStorage.setItem(AUTH_INVALID_KEY, '1');
}

export async function getAuthInvalid() {
  const raw = await AsyncStorage.getItem(AUTH_INVALID_KEY);
  return raw === '1';
}

export async function setAuthEmail(email: string | null) {
  if (!email) return AsyncStorage.removeItem(EMAIL_KEY);
  return AsyncStorage.setItem(EMAIL_KEY, email);
}

export async function getAuthEmail() {
  return AsyncStorage.getItem(EMAIL_KEY);
}