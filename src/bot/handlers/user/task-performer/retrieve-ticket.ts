import { Context } from "#root/bot/context.ts";
import { CallbackQueryContext } from "grammy";
import { TicketStatus, UserText } from "#root/bot/const/index.ts";
import { TicketType } from "#root/services/index.ts";
import { retrieveTicketData } from "#root/bot/callback-data/index.ts";

type Properties = {
  ctx: Context;
  ticket: TicketType;
};

const sendManagers = async ({ ctx, ticket }: Properties, text: string) => {
  const { petrol_station_id: petrolStationId } = ticket;
  const { managers } =
    await ctx.services.PetrolStation.getUnique(petrolStationId);

  if (!managers) {
    throw new Error("Managers not found");
  }

  const promises = managers.map(async (managerId) => {
    await ctx.api.sendMessage(managerId, text);
  });

  Promise.all(promises);
};

const sendManagersNotificationAboutRetrieveTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  await ctx.services.Ticket.update({
    ...ticket,
    status_id: TicketStatus.ReviewedManager,
  });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.RETRIEVE_TICKET,
  );
};

export const retrieveTicketHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { id } = retrieveTicketData.unpack(ctx.callbackQuery.data);
  const ticket = await ctx.services.Ticket.getUnique(id);

  await sendManagersNotificationAboutRetrieveTicket({ ctx, ticket });

  await ctx.editMessageText(UserText.RETRIEVE_TICKET);
};