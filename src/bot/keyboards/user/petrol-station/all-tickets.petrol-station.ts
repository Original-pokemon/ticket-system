import { selectTicketData } from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
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
      tickets.map(({ title, id, status_id: status }) => {
        if (!id) throw new Error("Invalid ticket id");

        return {
          text: title,
          callback_data: selectTicketData.pack({
            id,
            status,
          }),
        };
      }),
      1,
    ),
  );
};
