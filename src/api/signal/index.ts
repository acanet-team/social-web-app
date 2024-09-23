import { removePropertiesEmpty } from "@/utils/Helpers";
import httpClient from "..";
import type { getSignalCardParams, getSignalCardResponse } from "./model";
import type { BaseArrayResponsVersionDocs, BaseResponse } from "../model";

export const getSignalCards = (values: getSignalCardParams) => {
  const data = removePropertiesEmpty(values);
  return httpClient.get<BaseArrayResponsVersionDocs<getSignalCardResponse>>(
    `/v1/signal`,
    { query: data },
  );
};

export const getSignalDetail = (cardId: string) => {
  return httpClient.post<
    { cardId: string },
    BaseResponse<getSignalCardResponse>
  >(`/v1/signal/read/${cardId}`, {});
};
