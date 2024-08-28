import { removePropertiesEmpty } from "@/utils/Helpers";
import {
  GetCommunitiesParams,
  type CreateCommunityResponse,
  type GetACommunityParams,
  type GetCommunityResponse,
  type ICommunity,
  type PostCreateCommunityParams,
} from "./model";
import httpClient from "..";
import type { IPost, ResponseDto } from "../newsfeed/model";

export const getCommunities = ({
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

export const getACommunity = (id: string) => {
  return httpClient.get<GetACommunityParams<ICommunity>>(
    `/v1/community/detail/${id}`,
  );
};

export const createCommunity = (formData: FormData) => {
  return httpClient.post<FormData, CreateCommunityResponse<ICommunity>>(
    `/v1/community`,
    formData,
    {
      contentType: "multi-form",
    },
  );
};

export const editCommunity = (formData: FormData) => {
  return httpClient.patch<FormData, CreateCommunityResponse<ICommunity>>(
    `/v1/community`,
    formData,
    {
      contentType: "multi-form",
    },
  );
};

export const getCommunityPosts = (
  page: number,
  take: number,
  type: string,
  communityId: string,
) => {
  return httpClient.get<ResponseDto<IPost>>(
    `/v1/post?page=${page}&take=${take}&newsFeedType=${type}&communityId=${communityId}`,
  );
};
