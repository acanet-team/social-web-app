import httpClient from "..";
import type { BaseArrayResponsVersionDocs, BaseResponse } from "../model";
import {
  type FullSearchItem,
  type IFullSearchResponse,
  type IQuickSearchResponse,
} from "./model";

export const quickSearch = (text: string, countPerSection: number) => {
  return httpClient.get<BaseResponse<IQuickSearchResponse>>(
    `/v1/quick-search?text=${text}`,
  );
};

export const fullSearchByType = (text: string, type: "user" | "community") => {
  return httpClient.get<BaseArrayResponsVersionDocs<FullSearchItem>>(
    `/v1/full-search?text=${text}&type=${type}`,
  );
};
