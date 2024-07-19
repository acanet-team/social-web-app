import httpClient from '../index';

export const logout = () => {
  httpClient.get({ url: 'auth/logout' });
};
