import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearTokens, getTokenExpiry, isTokenExpired, setAuthInvalid } from "@/lib/auth/tokens";

const baseURL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:10000";

export const api = axios.create({
  baseURL,
//   timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

const verifyClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach token if present (prevents 401 after network is fixed)
api.interceptors.request.use(async (config) => {
  const token =
    (await AsyncStorage.getItem("accessToken")) ||
    (await AsyncStorage.getItem("apostle.accessToken")) ||
    (await AsyncStorage.getItem("apostle.token")) ||
    (await AsyncStorage.getItem("token")) ||
    (await AsyncStorage.getItem("jwt")) ||
    (await AsyncStorage.getItem("apostle.jwt"));

  if (token && (await isTokenExpired())) {
    await clearTokens();
    await setAuthInvalid(true);
    return config;
  }

  const isVerifyCall = typeof config.url === "string" && config.url.includes("/api/auth/verifyToken");
  if (token && !isVerifyCall) {
    try {
      await verifyClient.post(
        "/api/auth/verifyToken",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await setAuthInvalid(false);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        await clearTokens();
        await setAuthInvalid(true);
      }
    }
  }

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await clearTokens();
      await setAuthInvalid(true);
    }
    return Promise.reject(error);
  }
);