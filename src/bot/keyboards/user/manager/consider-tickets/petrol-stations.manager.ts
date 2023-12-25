import { selectConsiderPetrolStationData } from "#root/bot/callback-data/index.ts";
import { TicketStatus } from "#root/bot/const/index.ts";
import { Context } from "#root/bot/context.ts";
import { chunk } from "#root/bot/helpers/index.ts";
import { InlineKeyboard } from "grammy";

export const createFilteredPetrolStationsPerTicketStatusKeyboard = async (
  ctx: Context,
) => {
  const { services, session } = ctx;
  const { user } = session;
  const { ticket: tickets } = await services.Manager.getUnique(user.id);
  const ticketsId =
    tickets
      ?.map((ticket) => {
        return ticket.ticket;
      })
      .flat() || [];

  const ticketsInfo = await services.Ticket.getSelect(ticketsId);

  const petrolStations = ticketsInfo
    .filter((ticket) => ticket.status_id === TicketStatus.ReviewedManager)
    .map((ticket) => ticket.petrol_station_id);

  const users = petrolStations?.length
    ? await services.User.getSelect(petrolStations)
    : [];

  return InlineKeyboard.from(
    chunk(
      users.map(({ user_name: userName, id }) => ({
        text: userName,
        callback_data: selectConsiderPetrolStationData.pack({
          id,
        }),
      })),
      2,
    ),
  );
};
