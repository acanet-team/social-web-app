import type { AxiosError } from 'axios';
import axios from 'axios';
import { useCallback, useState } from 'react';

interface FetchConfigType {
  url: string;
  method?: string;
  headers?: { [key: string]: string };
  data?: Object;
  withCredentials: Boolean;
}

const useAxios = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = useCallback(
    async (fetchConfig: FetchConfigType, dataHandleFn: any) => {
      setIsLoading(true);
      try {
        const response = await axios({
          baseURL:
            process.env.NEXT_SERVER_API_DOMAIN ?? 'http://localhost:3000',
          url: fetchConfig.url,
          method: fetchConfig.method ? fetchConfig.method : 'GET',
          headers: fetchConfig.headers ? fetchConfig.headers : {},
          data: fetchConfig.data ? fetchConfig.data : null,
          withCredentials: true,
        });

        dataHandleFn(response);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { isLoading, sendRequest };
};

export default useAxios;
