import { removePropertiesEmpty } from "@/utils/Helpers";
import {
  GetCommunitiesParams,
  type GetCommunityResponse,
  type ICommunity,
} from "./model";
import httpClient from "..";

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
