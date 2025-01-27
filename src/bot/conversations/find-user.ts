import { Context } from "#root/bot/context.js";
import { viewUserProfileHandler } from "#root/bot/handlers/index.js";
import { Container } from "#root/container.js";
import { createConversation } from "@grammyjs/conversations";
import { AdminText } from "../const/index.js";

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
      ctx.services = services;
      return viewUserProfileHandler(ctx, id);
    }

    await answerCtx.reply(AdminText.FindUser.NOT_FOUND);
  }, FIND_USER_CONVERSATION);
