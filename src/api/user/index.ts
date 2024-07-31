import httpClient from "../index";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDAsInJvbGUiOnsiaWQiOjMsIm5hbWUiOiJpbnZlc3RvciIsIl9fZW50aXR5IjoiUm9sZUVudGl0eSJ9LCJzZXNzaW9uSWQiOjI1NywiaWF0IjoxNzIxNzk0ODAyLCJleHAiOjE3MjIzOTk2MDJ9.L4QVbAQIoovogrIY3JJawT3XKToxwYr8UJp0IwwSpGI";
export const createProfileRequest = (values: any) => {
  return httpClient.post({
    url: "/v1/user-profile",
    data: values,
    config: {
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  });
};

export const createGetBrokersRequest = (page: number, take: number) => {
  return httpClient.get({
    url: `/v1/users?type=broker&page=${page}&take=${take}`,
    config: {
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  });
};

export const createGetAllTopicsRequest = (page: number, take: number) => {
  return httpClient.get({
    url: `/v1/interest-topic?page=${page}&take=${take}&sort={"orderBy":"topic_name","order":"ASC"}`,
    config: {
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  });
};

export const subscribeTopicsRequest = (values: string[]) => {
  return httpClient.post({
    url: "/v1/interest-topic/subscribe",
    data: { interestTopicIds: values },
    config: {
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  });
};

export const getUserInfoRequest = (token: string) => {
  const header = new Headers();
  header.append("Authorization", "Bearer " + token ?? "");
  return httpClient.get(
    "/v1/auth/me",
    {
      headers: header,
    },
  );
}