import { selectPetrolStationData } from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
import { InlineKeyboard } from "grammy";

export const createPetrolStationsPerTicketStatusKeyboard = async (
  ctx: Context,
) => {
  const { services, session } = ctx;
  const { user } = session;
  const { tickets } = await services.Manager.getUnique(user.id);
  const petrolStations = tickets
    ?.filter((ticket) => ticket.tickets.length > 0)
    .map((ticket) => {
      return ticket.petrol_station;
    });

  const users = petrolStations?.length
    ? await services.User.getSelect(petrolStations)
    : [];

  return InlineKeyboard.from(
    chunk(
      users.map(({ user_name: userName, id }) => ({
        text: userName,
        callback_data: selectPetrolStationData.pack({
          id,
        }),
      })),
      2,
    ),
  );
};
