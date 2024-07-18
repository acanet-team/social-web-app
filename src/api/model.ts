import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

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

export type GetRequestParams = {
  url: string;
  params?: unknown;
  config?: RequestConfig;
};

export type PostRequestParams = {
  url: string;
  data?: unknown;
  config?: RequestConfig;
};

export type BaseResponse<T> = {
  data: T;
  code: number;
  message: string;
  success: boolean;
};

export type BaseApiResponse<T> = Promise<T>;

export type PaginationResponse<T> = {
  code: number;
  message: string;
  success: boolean;
  data: {
    records: T[];
    total: number;
  };
};
