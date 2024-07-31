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
      topicName: any;
      id: string;
    }[];
    meta: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      page: number;
      take: number;
      total: number;
      totalPage: number;
    };
  };
}

export const getTopics = (page: number, search: string): Promise<GetTopicsResponse> => {
  let url = `/v1/interest-topic?order=DESC`;
  page ? (url += `&page=${page}&take=20`) : null;
  search ? (url += `&keyword=${search}`) : null;
  return httpClient.fetch({
    url: url,
    method: "GET",
    contentType: "json",
  });
};