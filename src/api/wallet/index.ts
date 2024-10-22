import httpClient from "..";
import type { BaseResponse } from "../model";
import type { joinGroupValueParams } from "./model";

export const updateWalletAddress = (address: string) => {
  return httpClient.patch(`/v1/users/wallet`, { walletAddress: address });
};

export const joinPaidCommunity = (values: joinGroupValueParams) => {
  return httpClient.post(`/v1/community/paid-join`, values);
};
