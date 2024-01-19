import { selectTicketData } from "#root/bot/callback-data/index.ts";
import { Context } from "#root/bot/context.ts";
import { chunk } from "#root/bot/helpers/index.ts";
import { InlineKeyboard } from "grammy";

export const createAllTicketsKeyboard = async (ctx: Context) => {
  const { services, session } = ctx;

  const { user } = session;
  const { tickets: ticketsPerStations } =
    await services.PetrolStation.getUnique(user.id);

  const tickets = ticketsPerStations
    ? await services.Ticket.getSelect(ticketsPerStations)
    : [];

  return InlineKeyboard.from(
    chunk(
      tickets.map(({ title, id }) => {
        if (!id) throw new Error("Invalid ticket id");

        return {
          text: title,
          callback_data: selectTicketData.pack({
            id,
          }),
        };
      }),
      1,
    ),
  );
};
