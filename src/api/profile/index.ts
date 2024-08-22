import httpClient from "../index";
import type { AllProfileResponse } from "../model";
import type { BrokerProfile } from "./model";

export const getProfile = (id: string) => {
  return httpClient.get<AllProfileResponse>(`/v1/user-profile/${id}`);
};
