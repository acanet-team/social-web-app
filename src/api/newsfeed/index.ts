import httpClient from "../index";
import { type PostRequestParams } from "../model";
import { likeParams, type Comment, type CommentResponse } from "./model";
import type { T } from "vitest/dist/reporters-yx5ZTtEV.js";

export const header = new Headers();

export const likeRequest = (
  values: any,
  headers: Headers = undefined as unknown as Headers
) => {
  return httpClient.post<PostRequestParams<likeParams>, T>("/v1/post", values, {
    headers
  });
};

export const getComments = (
  page: number,
  take: number,
  postId: string,
  headers: Headers = undefined as unknown as Headers
) => {
  return httpClient.get<CommentResponse<Comment>>(
    `/v1/comment?order=DESC&page=${page}&take=${take}&postId=${postId}`,
    {
      headers,
    }
  );
};

export const getPosts = (page: number, take: number, type: string,
    headers: Headers = undefined as unknown as Headers) => {
  return httpClient.get(
    `/v1/post?page=${page}&take=${take}&newsFeedType=${type}`,
    {
      headers
    },
  );
};

export const postComment = (
  values: { content: string; postId: string },
  headers: Headers = undefined as unknown as Headers
) => {
  return httpClient.post("/v1/comment", values, {
    headers,
  });
};

export const deleteComment = (
  commentId: string,
  headers: Headers = undefined as unknown as Headers
) => {
  return httpClient.delete(`/v1/comment/${commentId}`, {
    headers,
  });
};

export const deletePost = (
  postId: string,
  headers: Headers = undefined as unknown as Headers
) => {
  return httpClient.delete(`v1/post/${postId}`, {
    headers,
  });
};
