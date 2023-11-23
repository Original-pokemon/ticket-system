import { ErrorHandler } from "grammy";
import type { Context } from "#root/bot/context.ts";
import { getUpdateInfo } from "#root/bot/helpers/logging.ts";

export const errorHandler: ErrorHandler<Context> = (error) => {
  const { ctx } = error;

  ctx.logger.error({
    err: error.error,
    update: getUpdateInfo(ctx),
  });
};
