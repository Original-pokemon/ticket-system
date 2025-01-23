import {
  withdrawTicketData,
  deleteTicketData,
} from "#root/bot/callback-data/index.js";
import { UserText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { sendTaskPerformers } from "#root/bot/helpers/send-notification.js";
import { CallbackQueryContext } from "grammy";

import { EDIT_TICKET_CONVERSATION } from "#root/bot/conversations/edit-ticket/edit-ticket.js";

export const withdrawTicketHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { ticketId } = withdrawTicketData.unpack(ctx.callbackQuery.data);

  const ticket = await ctx.services.Ticket.getUnique(ticketId);
  const { title, petrol_station_id: petrolStationId } = ticket;
  const { user_name: userName } =
    await ctx.services.User.getUnique(petrolStationId);
  await ctx.services.Ticket.delete(ticketId);
  await ctx.editMessageText(
    UserText.Notification.WITHDRAW({ title, petrolStation: userName }),
  );

  await sendTaskPerformers(
    { ctx, ticket },
    UserText.Notification.WITHDRAW({ title, petrolStation: userName }),
  );
};

export const editTicketHandler = async (ctx: CallbackQueryContext<Context>) => {
  await ctx.conversation.enter(EDIT_TICKET_CONVERSATION);
};

export const deleteTicketHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { id } = deleteTicketData.unpack(ctx.callbackQuery.data);
  try {
    await ctx.services.Ticket.delete(id);
    await ctx.editMessageText(UserText.DELETE_TICKET);
  } catch (error) {
    ctx.logger.error(error);
  }
};
