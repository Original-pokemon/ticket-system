import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";
import { createAdminStartMenu } from "#root/bot/keyboards/admin/admin-panel.js";
import { isBlocked, isUnauthorized } from "#root/bot/filters/index.js";
import { isAdmin } from "#root/bot/filters/is-bot-admin.js";
import { BotText } from "#root/bot/const/text.js";
import { createUserInlineKeyboard } from "#root/bot/keyboards/index.js";
import { commandsText } from "#root/bot/const/index.js";

export const welcomeCallbackHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { session, conversation } = ctx;

  const {
    user: { user_group: userGroup },
    groups: { data: cachedGroups },
  } = session;

  if (!cachedGroups) {
    throw new Error("Gropes not found");
  }
  const group = cachedGroups[userGroup];

  await conversation.exit();

  if (isAdmin(userGroup)) {
    try {
      await ctx.editMessageText(BotText.Welcome.ADMIN, {
        reply_markup: createAdminStartMenu(),
      });
      return;
    } catch {
      return ctx.reply(BotText.Welcome.ADMIN, {
        reply_markup: createAdminStartMenu(),
      });
    }
  }
  if (isUnauthorized(userGroup)) {
    return ctx.reply(BotText.Welcome.UNAUTHORIZED);
  }

  if (isBlocked(userGroup)) {
    return ctx.reply(BotText.Welcome.BLOCKED);
  }
  const messageText = BotText.Welcome.getUserText(
    group.description,
    Object.values(commandsText),
  );
  const inlineKeyboard = await createUserInlineKeyboard(group.id);

  try {
    await ctx.editMessageText(messageText, {
      reply_markup: inlineKeyboard,
    });
  } catch {
    await ctx.reply(messageText, {
      reply_markup: inlineKeyboard,
    });
  }
};
