import { cookies } from "next/headers";
import httpClient from "../index";
import {
  GetRequestParams,
  type CreateProfileParams,
  type AllBrokersResponse,
  type PostRequestParams,
  type Regions,
  type subcribeTopicsParam,
  type topicsResponse,
} from "../model";
import type { IUser } from "./model";
import type { T } from "vitest/dist/reporters-yx5ZTtEV.js";

export const header = new Headers();

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywicm9sZSI6eyJpZCI6MiwibmFtZSI6InVzZXIiLCJfX2VudGl0eSI6IlJvbGVFbnRpdHkifSwic2Vzc2lvbklkIjo5LCJpYXQiOjE3MjEwMTc3NzcsImV4cCI6MTgwNzQxNzc3N30.gM1-jdute6OTZE6O_ihrMegtlwODZyfu_Nk4GFAR7-Q";

export const createProfileRequest = (values: any) => {
  // header.set("Authorization", "Bearer " + token);
  return httpClient.post<PostRequestParams<CreateProfileParams>, T>(
    "/v1/user-profile",
    values,
  );
};

export const getRegionRequest = () => {
  // header.set("Authorization", "Bearer " + token);
  return httpClient.get<Regions>("/v1/master-data/regions");
};

export const createGetBrokersRequest = (page: number, take: number) => {
  header.set("Authorization", "Bearer " + token);
  return httpClient.get<AllBrokersResponse<IUser>>(
    `/v1/users?type=broker&page=${page}&take=${take}&sort=[{"orderBy":"followers_count","order":"DESC"}]`,
    {
      headers: header,
    },
  );
};

export const createGetAllTopicsRequest = (page: number, take: number) => {
  return httpClient.get<GetRequestParams<topicsResponse>>(
    `/v1/interest-topic?page=${page}&take=${take}&sort={"orderBy":"topic_name","order":"ASC"}`,
    {
      headers: header,
    },
  );
};

export const subscribeTopicsRequest = (values: any) => {
  header.set("Authorization", "Bearer " + token);
  return httpClient.post<subcribeTopicsParam<T>, T>(
    "/v1/interest-topic/subscribe",
    values,
    {
      headers: header,
    },
  );
};

export const getUserInfoRequest = (token: string) => {
  const header = new Headers();
  header.append("Authorization", "Bearer " + token ?? "");
  return httpClient.get("/v1/auth/me", {
    headers: header,
  });
};
