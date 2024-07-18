import httpClient from '..';

export const logout = () => {
  httpClient.get({ url: 'auth/logout' });
};
