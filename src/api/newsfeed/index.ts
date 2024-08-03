import type { promises } from "dns";
import httpClient from "../index";
import { type BaseApiResponse, type PostRequestParams } from "../model";
import { likeParams, type Comment, type CommentResponse } from "./model";
import type { T } from "vitest/dist/reporters-yx5ZTtEV.js";

export const header = new Headers();

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywicm9sZSI6eyJpZCI6MiwibmFtZSI6InVzZXIiLCJfX2VudGl0eSI6IlJvbGVFbnRpdHkifSwic2Vzc2lvbklkIjo5LCJpYXQiOjE3MjEwMTc3NzcsImV4cCI6MTgwNzQxNzc3N30.gM1-jdute6OTZE6O_ihrMegtlwODZyfu_Nk4GFAR7-Q";
export const likeRequest = (values: any) => {
  header.set("Authorization", "Bearer " + token);
  return httpClient.post<PostRequestParams<likeParams>, T>("/v1/post", values, {
    headers: header,
  });
};

export const getComments = (page: number, take: number, postId: string) => {
  header.set("Authorization", "Bearer " + token);
  return httpClient.get<CommentResponse<Comment>>(
    `/v1/comment?order=DESC&page=${page}&take=${take}&postId=${postId}`,
    {
      headers: header,
    },
  );
};

export const getPosts = (page: number, take: number, type: string) => {
  header.set("Authorization", "Bearer " + token);
  return httpClient.get(
    `/v1/post?page=${page}&take=${take}&newsFeedType=${type}`,
    {
      headers: header,
    },
  );
};

export const postComment = (values: { content: string; postId: string }) => {
  header.set("Authorization", "Bearer " + token);
  return httpClient.post("/v1/comment", values, {
    headers: header,
  });
};

export const deleteComment = (commentId: string) => {
  header.set("Authorization", "Bearer " + token);
  return httpClient.delete(`/v1/comment/${commentId}`, {
    headers: header,
  });
};

export const deletePost = (postId: string) => {
  header.set("Authorization", "Bearer " + token);
  return httpClient.delete(`v1/post/${postId}`, {
    headers: header,
  });
};
