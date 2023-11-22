import { Context } from "#root/bot/context.js";
import { CommandContext } from "grammy";
import { createAdminKeyboard } from "#root/bot/keyboards/admin/admin-panel.js";
import { isUnauthorized } from "#root/bot/filters/index.js";
import { isAdmin } from "#root/bot/filters/is-bot-admin.js";
import { BotText } from "#root/bot/const/text.js";

export const welcomeCommandHandler = async (ctx: CommandContext<Context>) => {
  const {
    services,
    session: {
      user: { user_group: userGroup },
    },
  } = ctx;

  const group = await services.Group.getUnique(userGroup);

  if (isAdmin(userGroup)) {
    return ctx.reply(BotText.Welcome.ADMIN, {
      reply_markup: await createAdminKeyboard(),
    });
  }
  if (isUnauthorized(userGroup)) {
    return ctx.reply(BotText.Welcome.UNAUTHORIZED);
  }
  return ctx.reply(BotText.Welcome.getUserText(group.description));
};
