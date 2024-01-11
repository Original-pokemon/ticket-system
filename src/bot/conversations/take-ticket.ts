import { Context } from "#root/bot/context.ts";
import { getPhotos, viewTicketProfile } from "#root/bot/handlers/index.ts";
import { Container } from "#root/container.ts";
import { createConversation } from "@grammyjs/conversations";
import { InlineKeyboard } from "grammy";
import { performedTicketData, sendTicketData } from "../callback-data/index.ts";
import { UserText } from "../const/index.ts";

export const TAKE_TICKET_CONVERSATION = "take-ticket";

export const takeTicketConversation = (container: Container) =>
  createConversation<Context>(async (conversation, ctx) => {
    const { services } = container;
    const { id: userId } = conversation.session.user;
    ctx.services = services;

    if (!ctx.callbackQuery?.data) {
      throw new Error("callback query not provided");
    }

    const { id: ticketId } = performedTicketData.unpack(ctx.callbackQuery.data);

    const conversationProperties = {
      ctx,
      conversation,
    };

    await ctx.reply(UserText.TakeTicket.COMMENT);

    const {
      msg: { text },
    } = await conversation.waitFor("message:text");

    const [photoUrs] = await getPhotos({
      ...conversationProperties,
      ctx,
    });

    await services.Comment.create({
      ticket_id: ticketId,
      user_id: userId,
      text,
      attachments: photoUrs,
    });

    const ticket = await services.Ticket.getUnique(ticketId);

    const keyboard = InlineKeyboard.from([
      [
        {
          text: UserText.TakeTicket.BUTTON,
          callback_data: sendTicketData.pack({
            id: ticketId,
          }),
        },
      ],
    ]);

    await viewTicketProfile({ ctx, ticket, inlineKeyboard: keyboard });
  }, TAKE_TICKET_CONVERSATION);
