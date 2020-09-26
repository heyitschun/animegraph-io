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
export const useAxiosRequest = (user) => {
  const [request, setRequest] = useState({
    loading: false,
    data: null,
    error: false
  });
  useEffect(() => {
    setRequest({
      loading: true,
      data: null,
      error: false
    })
    axios
      .get(
        "/api/get-top-ten",
        {
          params: {
            user: user
          }
        }
      )
      .then(res => {
        setRequest({
          loading: false,
          data: res.data,
          error: false
        })
      })
      .catch(() => {
        setRequest({
          loading: false,
          data: null,
          error: true
        })
      })
  }, [user]);
  return request;
};
