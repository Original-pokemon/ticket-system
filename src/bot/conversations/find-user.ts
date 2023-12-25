import { Context } from "#root/bot/context.ts";
import { viewUserProfileHandler } from "#root/bot/handlers/index.ts";
import { Container } from "#root/container.ts";
import { createConversation } from "@grammyjs/conversations";
import { AdminText } from "../const/index.ts";

export const FIND_USER_CONVERSATION = "find-user";

export const findUserConversation = (container: Container) =>
  createConversation<Context>(async (conversation, ctx) => {
    const { services } = container;
    await ctx.reply(AdminText.FindUser.TEXT);

    const answerCtx = await conversation.waitFor("message:text");
    const {
      msg: { text },
    } = answerCtx;

    if (text && !Number.isNaN(+text)) {
      const id = text;
      ctx.chatAction = "typing";

      return viewUserProfileHandler(ctx, services, id);
    }

    await answerCtx.reply(AdminText.FindUser.NOT_FOUND);
  }, FIND_USER_CONVERSATION);
