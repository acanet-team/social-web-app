import httpClient from "..";
import type { Notification } from "./model";
import type { BaseArrayResponseNotis } from "../model";
import type { IPost, ResponseDto, ResponseGetOneDto } from "../newsfeed/model";

export const getNotifications = (page: number, take: number) => {
  return httpClient.get<BaseArrayResponseNotis<Notification>>(
    `/v1/notification?page=${page}&take=${take}`,
  );
};

export const readNoti = (id: string) => {
  return httpClient.patch(`/v1/notification/read/${id}`, {});
};

export const getDetailPost = (id: string) => {
  return httpClient.get<ResponseGetOneDto<IPost>>(`/v1/post/${id}`, {});
};

export const patchReadAll = () => {
  httpClient.patch(`/v1/notification/readAll`, {});
  return;
};
