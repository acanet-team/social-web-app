import { removePropertiesEmpty } from "@/utils/Helpers";
import httpClient from "../index";
import {
  GetRequestParams,
  type CreateProfileParams,
  type AllBrokersResponse,
  type PostRequestParams,
  type Regions,
  type subcribeTopicsParam,
  type topicsResponse,
  type BaseResponse,
} from "../model";
import type { IBrokers } from "../newsfeed/model";
import type { InfoAdditionalBroker, IUser } from "./model";
import type { T } from "vitest/dist/reporters-yx5ZTtEV.js";

export const createProfileRequest = (
  values: any,
  headers: Headers = undefined as unknown as Headers,
) => {
  return httpClient.post<PostRequestParams<CreateProfileParams>, T>(
    "/v1/user-profile",
    values,
    { headers },
  );
};

export const whiteListBrokerAdditionalData = (value: InfoAdditionalBroker) => {
  return httpClient.post<
    BaseResponse<InfoAdditionalBroker>,
    InfoAdditionalBroker
  >("/v1/user-profile/broker-onboard", value);
};

export const getRegionRequest = (
  headers: Headers = undefined as unknown as Headers,
) => {
  return httpClient.get<Regions>("/v1/master-data/regions", { headers });
};

export const createGetBrokersRequest = (
  page: number,
  take: number,
  search: string,
  interestTopicIds: string,
) => {
  return httpClient.get<AllBrokersResponse<IBrokers>>(
    `/v1/users?type=broker&page=${page}&take=${take}&sort={"orderBy":"followers_count","order":"DESC"}&search=${search}&interestTopicIds=${interestTopicIds}`,
  );
};

export const createGetAllTopicsRequest = (
  page: number,
  take: number,
  headers: Headers = undefined as unknown as Headers,
) => {
  return httpClient.get<GetRequestParams<topicsResponse>>(
    `/v1/interest-topic?page=${page}&take=${take}&sort={"orderBy":"topic_name","order":"ASC"}`,
    {
      headers,
    },
  );
};

export const subscribeTopicsRequest = (
  values: any,
  headers: Headers = undefined as unknown as Headers,
) => {
  return httpClient.post<subcribeTopicsParam<T>, T>(
    "/v1/interest-topic/subscribe",
    values,
    {
      headers,
    },
  );
};

export const getUserInfoRequest = (
  headers: Headers = undefined as unknown as Headers,
) => {
  return httpClient.get("/v1/auth/me", { headers });
};

export const followABroker = (
  values: any,
  headers: Headers = undefined as unknown as Headers,
) => {
  return httpClient.post("/v1/users/follow", values, { headers });
};
