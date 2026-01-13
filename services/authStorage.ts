import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getUserId() {
  return (
    (await AsyncStorage.getItem("userId")) ||
    (await AsyncStorage.getItem("apostle.userId")) ||
    ""
  );
}

export async function getAccessToken() {
  return (
    (await AsyncStorage.getItem("accessToken")) ||
    (await AsyncStorage.getItem("apostle.accessToken")) ||
    (await AsyncStorage.getItem("apostle.token")) ||
    ""
  );
}