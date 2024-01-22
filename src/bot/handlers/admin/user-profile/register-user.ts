import { Context } from "#root/bot/context.js";
import { REGISTER_USER_CONVERSATION } from "#root/bot/conversations/index.js";
import { CallbackQueryContext } from "grammy";

export const registerUserHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  await ctx.conversation.enter(REGISTER_USER_CONVERSATION);
};
