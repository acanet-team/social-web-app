import 'dotenv/config';

import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';

const apiUrl = `http://localhost:3000`; // `${window?.location.protocol}//user-api.${window?.location.host}`;
const { NEXT_SERVER_API_DOMAIN } = process.env;

const instanceAxios = {
  baseURL: NEXT_SERVER_API_DOMAIN || apiUrl,
};
const axiosConfig = axios.create(instanceAxios);

const request = ({ method, url, data, ...rest }: AxiosRequestConfig) =>
  axiosConfig({
    method,
    url,
    data,
    withCredentials: true,
    ...rest,
  });
export { request };
