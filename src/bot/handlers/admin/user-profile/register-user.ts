import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";

export const registerUserHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  await ctx.conversation.enter("role-assignment");
};
