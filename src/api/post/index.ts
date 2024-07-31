import httpClient from "../index";
interface CreatePostRequest {
  interestTopicId: string;
  content: string;
  images: File[];
}
export const createNewPostRequest = (values: CreatePostRequest) => {
  return httpClient.fetch({
    url: "/v1/post",
    method: "POST",
    body: { ...values },
    contentType: "multi-form",
  });
};

interface GetTopicsResponse {
  data: {
    docs: {
      _id: string;
      topic_name: string;
    }[];
  };
}

export const getTopics = (): Promise<GetTopicsResponse> => {
  return httpClient.fetch({
    url: "/v1/interest-topic",
    method: "GET",
    contentType: "json",
  });
};