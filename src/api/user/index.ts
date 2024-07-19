import httpClient from '../index';

export const createProfileRequest = (values: any) => {
  return httpClient.post({
    url: 'api/v1/user-profile',
    config: {
      baseURL:
        process.env.NEXT_PUBLIC_NEXT_SERVER_API_DOMAIN ??
        'http://localhost:3001',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      withCredentials: true,
    },
    data: values,
  });
};

export const createGetBrokersRequest = () => {
  return httpClient.get({
    url: 'api/v1/users',
    config: {
      baseURL: 'http://localhost:3001',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      withCredentials: true,
    },
  });
};
