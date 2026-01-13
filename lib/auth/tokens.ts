import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_KEY = 'apostle.accessToken';
const REFRESH_KEY = 'apostle.refreshToken';
const EMAIL_KEY = 'apostle.authEmail'; // used to carry email across OTP flows

export async function getAccessToken() {
  return AsyncStorage.getItem(ACCESS_KEY);
}

export async function getRefreshToken() {
  return AsyncStorage.getItem(REFRESH_KEY);
}

export async function setTokens(access?: string | null, refresh?: string | null) {
  if (access === null) await AsyncStorage.removeItem(ACCESS_KEY);
  else if (typeof access === 'string') await AsyncStorage.setItem(ACCESS_KEY, access);

  if (refresh === null) await AsyncStorage.removeItem(REFRESH_KEY);
  else if (typeof refresh === 'string') await AsyncStorage.setItem(REFRESH_KEY, refresh);
}

export async function clearTokens() {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
}

export async function setAuthEmail(email: string | null) {
  if (!email) return AsyncStorage.removeItem(EMAIL_KEY);
  return AsyncStorage.setItem(EMAIL_KEY, email);
}

export async function getAuthEmail() {
  return AsyncStorage.getItem(EMAIL_KEY);
}