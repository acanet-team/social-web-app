import httpClient from "../index";
import type { IMe } from "../onboard/model";

export const getMe = () => {
  return httpClient.get<IMe>("/v1/auth/me");
};

export const logOut = (headers: Headers = undefined as unknown as Headers) => {
  return httpClient.post("api/v1/auth/logout", { headers });
};
