import axios, { AxiosInstance, AxiosError } from "axios";

import { logger } from "#root/logger.ts";

import axiosRetry from "axios-retry";
import { config } from "#root/config.ts";
import { REQUEST_TIMEOUT } from "./const.ts";

type DetailMessageType = {
  type: string;
  message: string;
};

class ApiService {
  #axios: AxiosInstance;

  constructor() {
    this.#axios = axios.create({
      baseURL: config.BACKEND_URL,
      timeout: REQUEST_TIMEOUT,
    });
    this.#axios.get("/");

    axiosRetry(this.#axios, {
      retries: 4,
      retryDelay: (retryCount) => {
        logger.warn(`Retrying attempt: ${retryCount}`);
        return retryCount * 5000; // time interval between retries
      },
    });

    this.#axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError<DetailMessageType>) => {
        if (error.response) {
          const detailMessage = error.response.data;
          logger.error(detailMessage);
        }
        throw new Error(error.message);
      },
    );
  }

  get api() {
    return this.#axios;
  }
}

export { ApiService };
