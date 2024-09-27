import type { ConnectionStatus, QuerryConnectionType } from "@/types/enum";
import httpClient from "..";
import type { BaseArrayResponsVersionDocs, BaseResponse } from "../model";
import type { IConnect, IConnectRequest } from "./model";

export const getAllConnect = (
  page: number,
  take: number,
  connectionType: string,
  connectionStatus: string,
) => {
  return httpClient.get<BaseArrayResponsVersionDocs<IConnect>>(
    `/v1/users/connection?page=${page}&take=${take}&connectionType=${connectionType}&connectionStatus=${connectionStatus}`,
  );
};

export const postConnectRequest = (
  addresseeId: number,
  connectionType: string,
) => {
  const requestBody = {
    addresseeId,
    connectionType,
  };
  return httpClient.post(`/v1/users/connection`, requestBody);
};

export const postConnectResponse = (requestId: string, action: string) => {
  const value = {
    requestId,
    action,
  };
  return httpClient.post(`/v1/users/connection/action`, value);
};
