import httpClient from "..";
import type { BaseResponse } from "../model";
import type {
  createSignalParams,
  createSignalResponse,
  joinGroupValueParams,
} from "./model";

export const updateWalletAddress = (address: string) => {
  return httpClient.patch(`/v1/users/wallet`, { walletAddress: address });
};

export const joinPaidCommunity = (values: joinGroupValueParams) => {
  return httpClient.post(`/v1/community/paid-join`, values);
};

export const donateBroker = (values: createSignalParams) => {
  return httpClient.post<
    createSignalParams,
    BaseResponse<createSignalResponse>
  >(`/v1/signal`, values);
};
