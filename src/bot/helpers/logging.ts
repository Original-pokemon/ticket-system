import type { Context } from "#root/bot/context.js";
import { Middleware } from "grammy";

import type { Update } from "@grammyjs/types";

export function getUpdateInfo(ctx: Context): Omit<Update, "update_id"> {
  // eslint-disable-next-line camelcase, @typescript-eslint/no-unused-vars
  const { update_id, ...update } = ctx.update;

  return update;
}

export function logHandle(id: string): Middleware<Context> {
  return async (ctx, next) => {
    const { user } = ctx.session;
    const startTime = performance.now();

    try {
      await next();
    } finally {
      const endTime = performance.now();
      ctx.logger.info({
        msg: `handle ${id}`,
        ...(id.startsWith("unhandled")
          ? { update: getUpdateInfo(ctx) }
          : {
              user_id: user?.id,
              user: user?.login || user.user_name,
              duration: endTime - startTime,
            }),
      });
    }
  };
}
