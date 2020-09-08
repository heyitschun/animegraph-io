import { useEffect, useState } from "react";
import axios from "axios";


/**
 * HTTP request with axios. Can be any HTTP method, as long as it
 * is specified in the `config` object
 * 
 * https://github.com/axios/axios#request-config
 * 
 * @param {object} config options for making HTTP request with axios
 */
export function useAxiosRequest(config) {
  const [response, setResponse] = useState({
    loading: false,
    data: null,
    error: false
  });

  useEffect(() => {
    setResponse({
      loading: true,
      data: null,
      error: false
    });
    axios.request(config)
      .then((res) => {
        setResponse({
          loading: false,
          data: res.data,
          error: false
        });
      })
      .catch(() => {
        setResponse({
          loading: false,
          data: null,
          error: true
        });
      })
  }, [url]);
  return response;
};
