import { Context } from "#root/bot/context.ts";
import { REGISTER_USER_CONVERSATION } from "#root/bot/conversations/index.ts";
import { CallbackQueryContext } from "grammy";

export const registerUserHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  await ctx.conversation.enter(REGISTER_USER_CONVERSATION);
};
