import { Middleware } from "grammy";
import { config } from "#root/config.js";
import { Context } from "../context.js";
import { UserGroup, BotText } from "../const/index.js";
import { getProfileText } from "../helpers/index.js";

export function authMiddleware(): Middleware<Context> {
  return async (ctx, next) => {
    const { id, first_name: firstName, last_name: lastName } = ctx.from || {};

    if (!id || !firstName) return;

    try {
      try {
        ctx.session.user = await ctx.services.User.getUnique(id.toString());
      } catch {
        const userName = `${firstName.replaceAll(" ", "")}${
          lastName ? `_${lastName}` : ""
        }`;

        const group = config.BOT_ADMIN_USER_ID.includes(id)
          ? UserGroup.Admin
          : UserGroup.Unauthorized;

        const userId = await ctx.services.User.create({
          id: id.toString(),
          user_name: userName,
          first_name: firstName,
          last_name: lastName,
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
