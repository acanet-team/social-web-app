import httpClient from "../index";
import type { IMe } from "../user/model";

export const getMe = () => {
  return httpClient.get<IMe>("/v1/auth/me");
};
