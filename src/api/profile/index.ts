import type { T } from "vitest/dist/reporters-yx5ZTtEV.js";
import httpClient from "../index";
import type {
  AllProfileResponse,
  BaseResponse,
  experienceParams,
  shortDescParams,
  socialMediaParams,
} from "../model";
import type { BrokerProfile } from "./model";

export const getProfile = (id: string) => {
  return httpClient.get<AllProfileResponse>(`/v1/user-profile/user/${id}`);
};

export const updateNewAbout = (about: string) => {
  const brokerProfile = { about };

  return httpClient.patch<shortDescParams, BaseResponse<T>>(
    `/v1/user-profile/update-profile`,
    { brokerProfile },
  );
};

export const putSocialMedia = (name: string, mediaUrl: string) => {
  const socialMedia = [{ name, mediaUrl }];
  return httpClient.put<socialMediaParams, BaseResponse<T>>(
    `/v1/user-profile/update-social-media`,
    { socialMedia },
  );
};

export const createNewExperiences = (experiences: experienceParams) => {
  return httpClient.post<experienceParams, BaseResponse<T>>(
    `/v1/user-profile/add-experience`,
    experiences,
  );
};

export const updateExperiences = (experiences: experienceParams) => {
  return httpClient.post<experienceParams, BaseResponse<T>>(
    `/v1/user-profile/update-experience`,
    experiences,
  );
};
