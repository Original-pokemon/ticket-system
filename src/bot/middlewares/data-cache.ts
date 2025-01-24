import { Middleware } from "grammy";
import { Context } from "#root/bot/context.js";

export function dataCacheMiddleware(): Middleware<Context> {
  return async (ctx, next) => {
    try {
      if (!ctx.session.categories) {
        const allCategories = await ctx.services.Category.getAll();
        const categoryMap = Object.fromEntries(
          allCategories.map((cat) => [cat.id, cat]),
        );
        ctx.session.categories = categoryMap;
      }

      if (!ctx.session.gropes) {
        const allGroups = await ctx.services.Group.getAll();
        const groupMap = Object.fromEntries(allGroups.map((g) => [g.id, g]));
        ctx.session.gropes = groupMap;
      }

      if (!ctx.session.statuses) {
        const allStatuses = await ctx.services.Status.getAll();
        const statusMap = Object.fromEntries(allStatuses.map((s) => [s.id, s]));
        ctx.session.statuses = statusMap;
      }
      return next();
    } catch (error) {
      ctx.logger.error(`dataCacheMiddleware error: ${error}`);
    }
  };
}
