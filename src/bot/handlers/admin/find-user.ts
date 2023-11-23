import { Context } from "#root/bot/context.ts";
import { HearsContext } from "grammy";

export const findUserCommandHandler = async (ctx: HearsContext<Context>) => {
  return ctx.conversation.enter("find-user");
};
