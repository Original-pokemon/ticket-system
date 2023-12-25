/* eslint-disable camelcase */
import { Middleware } from "grammy";
import { config } from "#root/config.ts";
import { Context } from "../context.ts";
import { UserGroup } from "../const/user-group.ts";
import { getProfileText } from "../helpers/user-profile.ts";
import { BotText } from "../const/text.ts";

export function authMiddleware(): Middleware<Context> {
  return async (ctx, next) => {
    const { id, first_name, last_name } = ctx.from || {};

    if (!id || !first_name) return;

    try {
      try {
        ctx.session.user = await ctx.services.User.getUnique(id.toString());
      } catch {
        const userName = `${first_name.replaceAll(" ", "")}${
          last_name ? `_${last_name}` : ""
        }`;

        const group = config.BOT_ADMIN_USER_ID.includes(id)
          ? UserGroup.Admin
          : UserGroup.Unauthorized;

        const userId = await ctx.services.User.create({
          id: id.toString(),
          user_name: userName,
          first_name,
          last_name,
          user_group: group,
        });

        ctx.session.user = await ctx.services.User.getUnique(userId);

        const adminMessages = config.BOT_ADMIN_USER_ID.map((adminId) => {
          const text = getProfileText(ctx.session.user);
          return ctx.api.sendMessage(adminId, text);
        });

        await Promise.all(adminMessages);
      }

      if (ctx.session.user.user_group === UserGroup.Blocked) {
        return ctx.reply(BotText.Welcome.BLOCKED);
      }

      return next();
    } catch (error) {
      ctx.logger.error(`auth.mv: ${error}`);
    }
  };
}
