import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { logger } from "#root/logger.js";

import axiosRetry from "axios-retry";
import { config } from "#root/config.js";
import { REQUEST_TIMEOUT } from "./const.js";

type DetailMessageType = {
  type: string;
  message: string;
};

const TOKEN_REFRESH_INTERVAL = 25 * 24 * 60 * 60 * 1000; // 25 дней

const createApi = async () => {
  const api = axios.create({
    baseURL: config.BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  let cookie: string[] | undefined;

  const authenticate = async () => {
    const response = await api.post("/bot-login", {
      bot_token: config.BOT_TOKEN,
    });
    cookie = response.headers["set-cookie"];
    logger.info("Bot authenticated successfully");
  };

  axiosRetry(api, {
    retries: 4,
    retryDelay: (retryCount) => {
      logger.warn(`Retrying attempt: ${retryCount}`);
      return retryCount * 5000;
    },
  });

  // Request interceptor: подставляем cookie
  api.interceptors.request.use((requestConfig) => {
    const configWithHeaders = requestConfig;
    configWithHeaders.headers.Cookie = cookie;
    return configWithHeaders;
  });

  // Response interceptor: перелогин при 401
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<DetailMessageType>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        logger.warn("Received 401, re-authenticating...");

        try {
          await authenticate();
          originalRequest.headers.Cookie = cookie;
          return api(originalRequest);
        } catch (authError) {
          logger.error("Re-authentication failed");
          throw authError;
        }
      }

      if (error.response) {
        const detailMessage = error.response.data;
        logger.error(detailMessage);
      }
      throw new Error(error.message);
    },
  );

  // Первичная авторизация
  await authenticate();

  // Проактивное обновление токена
  const refreshTimer = setInterval(async () => {
    try {
      await authenticate();
      logger.info("Token refreshed by schedule");
    } catch {
      logger.error("Scheduled token refresh failed");
    }
  }, TOKEN_REFRESH_INTERVAL);

  // Не блокируем завершение процесса таймером
  if (refreshTimer.unref) {
    refreshTimer.unref();
  }

  return api;
};

export { createApi };
