import api from "./axios";

export const loginApi = (data: { userId: string; password: string }) =>
  api.post("/auth/login", data);

export const createTest = (payload: any) => {
  return api.post("/tests", payload);
};
