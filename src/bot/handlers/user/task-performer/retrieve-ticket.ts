import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";
import { TicketStatus, UserText } from "#root/bot/const/index.js";
import { TicketType } from "#root/services/index.js";
import { retrieveTicketData } from "#root/bot/callback-data/index.js";
import { sendManagers } from "#root/bot/helpers/index.js";

type Properties = {
  ctx: Context;
  ticket: TicketType;
};

const sendManagersNotificationAboutRetrieveTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  if (!ticket.id) {
    throw new Error("Ticket Id not found");
  }

  await ctx.services.Ticket.updateTicketStatus({
    statusId: TicketStatus.ReviewedManager,
    ticketId: ticket.id,
    userId: ctx.session.user.id,
  });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.RETRIEVE_TICKET(ticket.title),
  );
};

export const retrieveTicketHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { id } = retrieveTicketData.unpack(ctx.callbackQuery.data);
  const ticket = await ctx.services.Ticket.getUnique(id);

  await sendManagersNotificationAboutRetrieveTicket({ ctx, ticket });

  await ctx.editMessageText(UserText.RETRIEVE_TICKET(ticket.title));
};
