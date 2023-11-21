import { fileURLToPath } from "node:url";

import { config } from "#root/config.js";
import { pino } from "pino";

export const logger = pino({
  level: config.LOG_LEVEL,
  transport: {
    targets: [
      ...(config.isDev
        ? [
            {
              target: "pino-pretty",
              level: config.LOG_LEVEL,
              options: {
                ignore: "pid,hostname",
                colorize: true,
                translateTime: true,
              },
            },
          ]
        : [
            {
              target: "pino/file",
              level: config.LOG_LEVEL,
              options: {
                destination: fileURLToPath(new URL("app.log", import.meta.url)),
              },
            },
          ]),
    ],
  },
});

export type Logger = typeof logger;
