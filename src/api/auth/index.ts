import httpClient from "../index";

export const getMe = () => {
  return httpClient.get("/v1/auth/me");
};
