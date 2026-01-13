import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:10000";

export const api = axios.create({
  baseURL,
//   timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Attach token if present (prevents 401 after network is fixed)
api.interceptors.request.use(async (config) => {
  const token =
    (await AsyncStorage.getItem("accessToken")) ||
    (await AsyncStorage.getItem("apostle.accessToken")) ||
    (await AsyncStorage.getItem("apostle.token"));

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});