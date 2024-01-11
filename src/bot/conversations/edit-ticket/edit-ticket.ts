import { Context } from "#root/bot/context.ts";
import { createConversation } from "@grammyjs/conversations";
import { Container } from "#root/container.ts";
import { viewTicketProfile } from "#root/bot/handlers/index.ts";
import { editTicketData } from "#root/bot/callback-data/index.ts";
import { ticketProfilePanelManager } from "#root/bot/keyboards/index.ts";
import { editTicket } from "./get-edited-ticket.ts";

export const EDIT_TICKET_CONVERSATION = "edit-ticket";

export const editTicketConversation = (container: Container) =>
  createConversation<Context>(async (conversation, ctx) => {
    const { services } = container;

    ctx.services = services;

    if (!ctx.callbackQuery?.data) {
      throw new Error("callback query not provided");
    }

    const { id: ticketId } = editTicketData.unpack(ctx.callbackQuery.data);

    const ticket = await services.Ticket.getUnique(ticketId);

    const editedTicket = await editTicket({
      ctx,
      conversation,
      ticket,
    });

    await services.Ticket.update(editedTicket);

    if (!ticket?.id) {
      throw new Error("ticket id not provided");
    }

    await viewTicketProfile({
      ctx,
      ticket: editedTicket,
      inlineKeyboard: ticketProfilePanelManager(ticket.id),
    });
  }, EDIT_TICKET_CONVERSATION);
