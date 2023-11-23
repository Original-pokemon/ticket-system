import { Context } from "#root/bot/context.ts";
import { CallbackQueryContext } from "grammy";

export const registerUserHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  await ctx.conversation.enter("role-assignment");
};
