import { Context } from "#root/bot/context.ts";
import { CallbackQueryContext } from "grammy";
import { ticketProfilePanel } from "#root/bot/keyboards/index.ts";
import { selectConsiderTicketData } from "#root/bot/callback-data/index.ts";
import { viewTicketProfile } from "../../view-ticket-profile.ts";

export const showConsiderTicketHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { id } = selectConsiderTicketData.unpack(ctx.callbackQuery.data);

  const ticket = await ctx.services.Ticket.getUnique(id);

  await viewTicketProfile({
    ctx,
    ticket,
    inlineKeyboard: ticketProfilePanel(id),
  });
};
