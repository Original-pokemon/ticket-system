import { Context } from "#root/bot/context.ts";
import { FIND_USER_CONVERSATION } from "#root/bot/conversations/index.ts";
import { HearsContext } from "grammy";

export const findUserCommandHandler = async (ctx: HearsContext<Context>) => {
  return ctx.conversation.enter(FIND_USER_CONVERSATION);
};
