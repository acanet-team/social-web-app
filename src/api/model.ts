import type { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { IHttpOptions } from "./index";
import { IUser } from "./onboard/model";
import type { IBrokers } from "./newsfeed/model";
import type { BrokerProfile, User, UserProfile } from "./profile/model";

export type RequestConfig = AxiosRequestConfig & {
  isHandleError?: boolean; // is request need auto handle error or not?

  requestId?: string; // requestId passing to manual cancel request

  headers?: Record<string, string>; // some customHeaders

  isKeepRequest?: boolean; // is not auto cancel request after timeout?

  useShopToken?: boolean;
};

export type ApiErrorResponse<T> = AxiosResponse<T> & { message: string };

export type ApiRequestParams = {
  method: Method;
  config: RequestConfig;
};

// export type GetRequestParams = {
//   url: string;
//   params?: unknown;
//   config?: RequestConfig;
// };

// export type PostRequestParams = {
//   url: string;
//   body?: unknown;
//   options?: RequestConfig;
// };

export type GetRequestParams<T> = {
  url: string;
  params?: T;
  options?: Omit<IHttpOptions, "url" | "method" | "body" | "contentType">;
};

export type PostRequestParams<T> = {
  url: string;
  body?: T;
  options?: Omit<IHttpOptions, "url" | "method" | "body">;
};

export type CreateProfileParams = {
  nickName: string;
  region: string;
  email: string;
};

export type subcribeTopicsParam<T> = {
  interestTopicIds: T;
  isOnboarding: boolean;
};

export type BaseResponse<T> = {
  status: number;
  success: boolean;
  message: string;
  data: T;
};

export type BaseApiResponse<T> = Promise<T>;

export type AllBrokersResponse<T> = {
  code: number;
  message: string;
  success: boolean;
  data: {
    docs?: IBrokers[];
    data?: IBrokers[];
    meta: {
      page: number;
      totalPage: number;
    };
  };
};

export type topicsResponse = {
  data: [{ id: string; topicName: string }];
};

export type Regions = {
  status: number;
  message: string;
  data: {
    key: string;
    value: [
      {
        code: string;
        name: string;
      },
    ];
    type: string;
  };
};

export type AllProfileResponse = {
  status: number;
  message: string;
  data: {
    user: User;
    userProfile: UserProfile;
    brokerProfile: BrokerProfile;
    followersCount: number;
    followingsCount: number;
    // rating: string;
    // coursesEnrolledCount: string;
    // followed: boolean;
  };
};
