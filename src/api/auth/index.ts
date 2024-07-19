import httpClient from '../index';

export const logout = () => {
  httpClient.get({ url: 'auth/logout' });
};

export const getMe = () => {
  return httpClient.get({
    url: '/v1/auth/me',
  });
};
