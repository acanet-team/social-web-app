import httpClient from "../index";
import { type PostRequestParams } from "../model";
import {
  likeParams,
  GetTopicsResponse,
  CreatePostRequest,
  type Comment,
  type CommentResponse,
  type ResponseDto,
} from "./model";
import type { T } from "vitest/dist/reporters-yx5ZTtEV.js";

export const header = new Headers();

export const likeRequest = (
  values: any,
  headers: Headers = undefined as unknown as Headers,
) => {
  return httpClient.post<PostRequestParams<likeParams>, T>("/v1/post", values, {
    headers,
  });
};

export const getComments = (
  page: number,
  take: number,
  postId: string,
  headers: Headers = undefined as unknown as Headers,
) => {
  return httpClient.get<CommentResponse<Comment>>(
    `/v1/comment?order=DESC&page=${page}&take=${take}&postId=${postId}`,
    {
      headers,
    },
  );
};

export const getPosts = (page: number, take: number, type: string) => {
  return httpClient.get<ResponseDto<T>>(
    `/v1/post?page=${page}&take=${take}&newsFeedType=${type}`,
  );
};

export const getTopics = (
  page: number,
  search: string,
): Promise<GetTopicsResponse> => {
  let url = `/v1/interest-topic?order=DESC`;
  page ? (url += `&page=${page}&take=20`) : null;
  search ? (url += `&keyword=${search}`) : null;
  return httpClient.fetch({
    url: url,
    method: "GET",
    contentType: "json",
  });
};

export const createNewPostRequest = (values: CreatePostRequest) => {
  return httpClient.fetch({
    url: "/v1/post",
    method: "POST",
    body: { ...values },
    contentType: "multi-form",
  });
};

export const postComment = (
  values: { content: string; postId: string },
  headers: Headers = undefined as unknown as Headers,
) => {
  return httpClient.post("/v1/comment", values, {
    headers,
  });
};

export const deleteComment = (
  commentId: string,
  headers: Headers = undefined as unknown as Headers,
) => {
  return httpClient.delete(`/v1/comment/${commentId}`, {
    headers,
  });
};

export const deletePost = (
  postId: string,
  headers: Headers = undefined as unknown as Headers,
) => {
  return httpClient.delete(`v1/post/${postId}`, {
    headers,
  });
};
