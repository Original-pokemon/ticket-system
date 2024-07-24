import { withdrawTicketData } from "#root/bot/callback-data/index.js";
import { UserText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { sendTaskPerformers } from "#root/bot/helpers/send-notification.js";
import { CallbackQueryContext } from "grammy";

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
