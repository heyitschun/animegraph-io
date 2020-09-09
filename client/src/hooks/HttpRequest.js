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
export const useAxiosRequest = (config) => {
  console.log(config);
  axios.request(config).then((res) => {
    console.log(res);
  });
};
