import type { T } from "vitest/dist/reporters-yx5ZTtEV.js";
import httpClient from "../index";
import type {
  AllProfileResponse,
  BaseResponse,
  educationParams,
  experienceParams,
  licenseParams,
  shortDescParams,
  socialMediaParams,
} from "../model";
import type { IPost, ResponseDto } from "../newsfeed/model";
import type {
  GetCommunitiesParams,
  GetCommunityResponse,
  ICommunity,
} from "../community/model";
import { removePropertiesEmpty } from "@/utils/Helpers";

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
  return httpClient.put<experienceParams, BaseResponse<T>>(
    `/v1/user-profile/update-experience`,
    experiences,
  );
};

export const deleteCompany = (id: string) => {
  return httpClient.delete(`/v1/user-profile/delete-experience/${id}`);
};

export const createNewSchool = (school: educationParams) => {
  return httpClient.post<educationParams, BaseResponse<T>>(
    `/v1/user-profile/add-education`,
    school,
  );
};
export const updateSchool = (school: educationParams) => {
  return httpClient.put<educationParams, BaseResponse<T>>(
    `/v1/user-profile/update-education`,
    school,
  );
};
export const deleteEducation = (id: string) => {
  return httpClient.delete(`/v1/user-profile/delete-education/${id}`);
};
export const createNewLicense = (license: licenseParams) => {
  return httpClient.post<licenseParams, BaseResponse<T>>(
    `/v1/user-profile/add-license`,
    license,
  );
};
export const updateLicense = (license: licenseParams) => {
  return httpClient.put<licenseParams, BaseResponse<T>>(
    `/v1/user-profile/update-license`,
    license,
  );
};
export const deleteLicense = (id: string) => {
  return httpClient.delete(`/v1/user-profile/delete-license/${id}`);
};

export const getMyPosts = (
  page: number,
  take: number,
  type: string,
  ownerId: number,
) => {
  return httpClient.get<ResponseDto<IPost>>(
    `/v1/post?page=${page}&take=${take}&newsFeedType=${type}&ownerId=${ownerId}`,
  );
};

export const getMyGroups = ({
  page,
  take,
  type,
  brokerId,
  search,
  feeType,
}: GetCommunitiesParams) => {
  const data = removePropertiesEmpty({
    page,
    take,
    type,
    brokerId,
    search,
    feeType,
  });
  return httpClient.get<GetCommunityResponse<ICommunity>>(`/v1/community`, {
    query: data,
  });
};
