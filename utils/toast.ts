import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

type ToastOptions = {
  title: string;
  message?: string;
  type?: ToastType;
};

const getSafeMessage = (input?: string) => {
  if (!input) return "";
  return input.length > 140 ? `${input.slice(0, 137)}...` : input;
};

export const showToast = ({ title, message, type = "info" }: ToastOptions) => {
  Toast.show({
    type,
    text1: title,
    text2: getSafeMessage(message),
  });
};

export const showSuccessToast = (title: string, message?: string) =>
  showToast({ title, message, type: "success" });

export const showErrorToast = (title: string, message?: string) =>
  showToast({ title, message, type: "error" });
