import { pino } from "pino";
import { config } from "#root/config.js";
import { fileURLToPath } from "node:url";

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
            {
              target: "pino-pretty",
              level: config.LOG_LEVEL,
              options: {
                ignore: "pid,hostname",
                colorize: true,
                translateTime: true,
              },
            },
          ]),
    ],
  },
});

export type Logger = typeof logger;
