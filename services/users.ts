import { api } from "@/lib/api/client";

export async function getUsers() {
  const res = await api.get("/api/user/getUsers");
  return res.data;
}

export async function getUserById(userId: string) {
  const res = await api.get(`/api/user/getUser/${encodeURIComponent(userId)}`);
  return res.data;
}