import httpClient from "../index";
import {
  GetRequestParams,
  type CreateProfileParams,
  type AllBrokersResponse,
  type PostRequestParams,
  type Regions,
  type subcribeTopicsParam,
  type topicsResponse,
} from "../model";
import { likeParams } from "./model";
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
