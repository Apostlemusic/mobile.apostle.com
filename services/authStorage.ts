import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearTokens, getTokenExpiry, setAuthInvalid } from "@/lib/auth/tokens";

export async function getUserId() {
  return (
    (await AsyncStorage.getItem("userId")) ||
    (await AsyncStorage.getItem("apostle.userId")) ||
    ""
  );
}

export async function getAccessToken() {
  const expiry = await getTokenExpiry();
  if (expiry && Date.now() > expiry) {
    await clearTokens();
    await setAuthInvalid(true);
    return "";
  }
  return (
    (await AsyncStorage.getItem("accessToken")) ||
    (await AsyncStorage.getItem("apostle.accessToken")) ||
    (await AsyncStorage.getItem("apostle.token")) ||
    ""
  );
}