import { Context } from "#root/bot/context.js";
import { viewTicketProfile } from "#root/bot/handlers/index.js";
import { Container } from "#root/container.js";
import { createConversation } from "@grammyjs/conversations";
import { InlineKeyboard } from "grammy";
import {
  performedTicketData,
  transferTicketData,
} from "../callback-data/index.js";
import { UserText } from "../const/index.js";

export const TAKE_TICKET_CONVERSATION = "take-ticket";

export const takeTicketConversation = (container: Container) =>
  createConversation<Context>(async (conversation, ctx) => {
    const { services } = container;
    ctx.services = services;

    if (!ctx.callbackQuery?.data) {
      throw new Error("callback query not provided");
    }

    const { id: ticketId } = performedTicketData.unpack(ctx.callbackQuery.data);

    await ctx.deleteMessage();

    const keyboard = InlineKeyboard.from([
      [
        {
          text: UserText.TakeTicket.BUTTON,
          callback_data: transferTicketData.pack({
            id: ticketId,
          }),
        },
      ],
    ]);

    await viewTicketProfile({ ctx, ticketId, inlineKeyboard: keyboard });
  }, TAKE_TICKET_CONVERSATION);
