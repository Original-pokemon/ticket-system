import { performance } from "node:perf_hooks";

import type { Context } from "#root/bot/context.ts";
import { getUpdateInfo } from "#root/bot/helpers/index.ts";
import { Middleware } from "grammy";

export function updateLogger(): Middleware<Context> {
  return async (ctx, next) => {
    ctx.api.config.use((previous, method, payload, signal) => {
      ctx.logger.debug({
        msg: "bot api call",
        method,
        payload,
      });

      return previous(method, payload, signal);
    });

    ctx.logger.debug({
      msg: "update received",
      update: getUpdateInfo(ctx),
    });

    const startTime = performance.now();
    try {
      await next();
    } finally {
      const endTime = performance.now();
      ctx.logger.debug({
        msg: "update processed",
        duration: endTime - startTime,
      });
    }
  };
}
