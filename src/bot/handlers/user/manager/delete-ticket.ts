import { deleteTicketData } from "#root/bot/callback-data/index.js";
import { UserText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";

export const deleteTicketHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { id } = deleteTicketData.unpack(ctx.callbackQuery.data);
  await ctx.services.Ticket.delete(id);
  await ctx.editMessageText(UserText.DELETE_TICKET);
};
