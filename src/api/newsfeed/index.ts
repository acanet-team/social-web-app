import type { promises } from "dns";
import httpClient from "../index";
import { type BaseApiResponse, type PostRequestParams } from "../model";
import { likeParams, type Comment, type CommentResponse } from "./model";
import type { T } from "vitest/dist/reporters-yx5ZTtEV.js";

export const header = new Headers();

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDAsInJvbGUiOnsiaWQiOjMsIm5hbWUiOiJpbnZlc3RvciIsIl9fZW50aXR5IjoiUm9sZUVudGl0eSJ9LCJzZXNzaW9uSWQiOjM2OCwiaWF0IjoxNzIxOTY5OTAwLCJleHAiOjE3MjI1NzQ3MDB9.Ee9_InUTVKLSuiHX-QxJqyheD32DVUDhlxOpOCE5vKg";

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
    `/v1/post?page=${page}&take=${take}&type=${type}&sort=[{"orderBy":"createdAt","order":"DESC"}]`,
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
