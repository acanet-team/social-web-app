import { removePropertiesEmpty } from "@/utils/Helpers";
import httpClient from "..";
import type {
  createSignalParams,
  createSignalResponse,
  getSignalCardParams,
  getSignalCardResponse,
  ISignalDaily,
  symbolEntryPriceResponse,
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

export const claimLuckyToken = (id: string) => {
  return httpClient.post<{ id: string }, BaseResponse<any>>(
    `/v1/signal/claim/${id}`,
    {},
  );
};

export const trackSignal = (id: string, type: "track" | "untrack") => {
  return httpClient.post<{ id: string }, BaseResponse<any>>(
    `/v1/signal/tracking`,
    { signalId: id, type: type },
  );
};

export const getEntryPrice = (symbol: string) => {
  return httpClient.get<symbolEntryPriceResponse>(
    `/v1/signal/symbol?symbol=${symbol}&type=spot`,
  );
};

export const createSignal = (values: createSignalParams) => {
  return httpClient.post<
    createSignalParams,
    BaseResponse<createSignalResponse>
  >(`/v1/signal`, values);
};
