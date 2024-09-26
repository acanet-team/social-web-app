import { removePropertiesEmpty } from "@/utils/Helpers";
import httpClient from "..";
import type {
  getSignalCardParams,
  getSignalCardResponse,
  ISignalDaily,
} from "./model";
import type {
  BaseArrayResponse,
  BaseArrayResponsVersionDocs,
  BaseResponse,
} from "../model";

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

export const getSignalsNewFeed = () => {
  return httpClient.get<BaseArrayResponse<ISignalDaily>>(`/v1/signal/daily`);
};

export const getSignalPairs = (search: string) => {
  return httpClient.get(`/v1/signal/symbols?search=${search}`);
};
