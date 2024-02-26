import axios, { AxiosError } from "axios";

import { logger } from "#root/logger.js";

import axiosRetry from "axios-retry";
import { config } from "#root/config.js";
import { REQUEST_TIMEOUT } from "./const.js";

type DetailMessageType = {
  type: string;
  message: string;
};

const createApi = async () => {
  const api = axios.create({
    baseURL: config.BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  axiosRetry(api, {
    retries: 4,
    retryDelay: (retryCount) => {
      logger.warn(`Retrying attempt: ${retryCount}`);
      return retryCount * 5000; // time interval between retries
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError<DetailMessageType>) => {
      if (error.response) {
        const detailMessage = error.response.data;
        logger.error(detailMessage);
      }
      throw new Error(error.message);
    },
  );

  const { headers } = await api.post("/login", {
    username: config.BACKEND_USERNAME,
    password: config.BACKEND_PASSWORD,
  });

  api.interceptors.request.use((requestConfig) => {
    const configWithHeaders = requestConfig;
    configWithHeaders.headers.Cookie = headers["set-cookie"];

    return configWithHeaders;
  });

  return api;
};

export { createApi };
