import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

import type {
  ApiRequestParams,
  BaseApiResponse,
  BaseResponse,
  GetRequestParams,
  PostRequestParams,
} from './model';

class HttpClient {
  instance: AxiosInstance;

  isCheckAuth = true;

  isKeepRequest = false;

  accessToken = '';

  requestInstance: {
    [key: string]: AbortController;
  } = {};

  constructor(config: AxiosRequestConfig) {
    this.instance = createAxios(config);
  }

  initTokenCancel = (
    requestId: string,
    abortInstance: AbortController,
  ): void => {
    this.requestInstance[requestId] = abortInstance;
  };

  // Cancel request

  cancelRequest = (requestId: string, isTimeoutCancel?: boolean) => {
    console.log(`cancelRequest from ${requestId}`);
    console.log('requestId', this.requestInstance[requestId]);
    if (this.requestInstance[requestId]) {
      this.requestInstance[requestId]?.abort();

      delete this.requestInstance[requestId];

      if (isTimeoutCancel) {
        showErrorMessage('Request Timeout!');
      }
    }
  };

  fetchApi = <T>({ method, config }: ApiRequestParams): BaseApiResponse<T> => {
    const {
      url = '',
      isKeepRequest = this.isKeepRequest,
      headers: customHeaders = {},
      isHandleError = true,
      requestId = `${url}-${new Date().getTime()}`,
      ...otherConfig
    } = config;

    const timeout = process.env.NEXT_PUBLIC_REQUEST_TIMEOUT;

    const controller = new AbortController();
    this.initTokenCancel(requestId, controller);
    const cancelTimeout = isKeepRequest
      ? null
      : setTimeout(() => {
          this.cancelRequest(requestId, true);
        }, Number(timeout));

    return new Promise((resolve, reject) => {
      this.instance
        .request<BaseResponse<T>>({
          method,
          url,
          headers: customHeaders,
          signal: controller.signal,
          withCredentials: true,
          ...otherConfig,
        })
        .then((response) => {
          resolve(response.data as never);
        })

        .catch((err) => {
          if (err.code !== 'ERR_CANCELED' && isHandleError) {
            handleError(err);
          }
          reject(err);
        })

        .finally(() => {
          if (this.requestInstance[requestId]) {
            delete this.requestInstance[requestId];
          }

          if (cancelTimeout) {
            clearTimeout(cancelTimeout);
          }
        });
    });
  };

  get = <T>({ url, config, params }: GetRequestParams): BaseApiResponse<T> => {
    return this.fetchApi<T>({
      method: 'GET',
      config: {
        ...(config || {}),
        url,
        params,
      },
    });
  };

  post = <T>({ url, config, data }: PostRequestParams): BaseApiResponse<T> => {
    return this.fetchApi<T>({
      method: 'POST',

      config: {
        ...(config || {}),
        url,
        data,
      },
    });
  };

  patch = <T>({ url, config, data }: PostRequestParams): BaseApiResponse<T> => {
    return this.fetchApi<T>({
      method: 'PATCH',

      config: {
        ...(config || {}),
        url,
        data,
      },
    });
  };

  put = <T>({ url, config, data }: PostRequestParams): BaseApiResponse<T> => {
    return this.fetchApi<T>({
      method: 'PUT',

      config: {
        ...(config || {}),
        url,
        data,
      },
    });
  };

  delete = <T>({
    url,
    config,
    params,
  }: GetRequestParams): BaseApiResponse<T> => {
    return this.fetchApi<T>({
      method: 'DELETE',

      config: {
        ...(config || {}),
        url,
        params,
      },
    });
  };
}

const showErrorMessage = (m: string) => {
  console.log('error message', m);
};

export const handleError = (error: AxiosError<{ message: string }>) => {
  const msg = error.response?.data?.message;
  showErrorMessage(
    msg || error.message || 'Something went wrong, please try again',
  );

  // TODO captureException

  // if (error.response) {

  //   // The request was made and the server responded with a status code

  //   // that falls out of the range of 2xx

  // } else if (error.request) {

  //   // The request was made but no response was received

  //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of

  //   // http.ClientRequest in node.js

  // } else {

  //   // Something happened in setting up the request that triggered an Error

  // }
};

const createAxios = (config: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    headers: { 'Content-Type': 'application/json' },

    ...config,
  });

  axiosInstance.interceptors.request.use(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    async function (config) {
      // Do something before request is sent

      if (config.url?.startsWith('/')) {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        config.url = API_URL + config.url;
      }

      return config;
    },

    function (error) {
      // Do something with request error

      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    function (response) {
      return response;
    },

    function (error) {
      if (error.response.status === 401) {
        // TODO handle
      }
      // Any status codes that falls outside the range of 2xx cause this function to trigger

      // Do something with response error

      return Promise.reject(error);
    },

    { synchronous: true },
  );

  return axiosInstance;
};

const httpClient = new HttpClient({});
export default httpClient;
