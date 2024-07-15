import { useState, useCallback } from "react";
import axios from "axios";

const useAxios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (fetchConfig, dataHandleFn) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios({
        url: fetchConfig.url,
        method: fetchConfig.method ? fetchConfig.method : "GET",
        headers: fetchConfig.header ? fetchConfig.header : {},
        data: fetchConfig.body ? JSON.stringify(fetchConfig.body) : null,
        withCredentials: true
      })

      if (!response.ok) {
        throw new Error("Request failed!");
      }

      const data = await response.json();
      dataHandleFn(data);
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
    setIsLoading(false);
  }, []);

  return { isLoading, error, sendRequest };
};

export default useAxios;