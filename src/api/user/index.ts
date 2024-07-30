import httpClient from "../index";
import type { PaginationResponse } from "../model";

export const header = new Headers();

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDAsInJvbGUiOnsiaWQiOjMsIm5hbWUiOiJpbnZlc3RvciIsIl9fZW50aXR5IjoiUm9sZUVudGl0eSJ9LCJzZXNzaW9uSWQiOjM2OCwiaWF0IjoxNzIxOTY5OTAwLCJleHAiOjE3MjI1NzQ3MDB9.Ee9_InUTVKLSuiHX-QxJqyheD32DVUDhlxOpOCE5vKg";

export const createProfileRequest = (values: any) => {
  header.set("Authorization", "Bearer " + token);
  return httpClient.post("/v1/user-profile", values, {
    headers: header,
  });
};

export const getRegionRequest = () => {
  header.set("Authorization", "Bearer " + token);
  return httpClient.get("/v1/master-data/regions");
};

export const createGetBrokersRequest = (page: number, take: number) => {
  header.set("Authorization", "Bearer " + token);
  return httpClient.get(
    `/v1/users?type=broker&page=${page}&take=${take}&sort=[{"orderBy":"followers_count","order":"DESC"}]`,
    {
      headers: header,
    },
  );
};

export const createGetAllTopicsRequest = (page: number, take: number) => {
  header.set("Authorization", "Bearer " + token);
  return httpClient.get(
    `/v1/interest-topic?page=${page}&take=${take}&sort={"orderBy":"topic_name","order":"ASC"}`,
    {
      headers: header,
    },
  );
};

export const subscribeTopicsRequest = (values: { interestTopicIds: any[] }) => {
  header.set("Authorization", "Bearer " + token);
  return httpClient.post("/v1/interest-topic/subscribe", values, {
    headers: header,
  });
};
