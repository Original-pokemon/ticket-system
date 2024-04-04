import { selectPetrolStationCreateTicketData } from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
import { InlineKeyboard } from "grammy";

export const createPetrolStationsKeyboard = async (ctx: Context) => {
  const { services, session } = ctx;
  const { user } = session;
  const { tickets } = await services.Manager.getUnique(user.id);
  const petrolStations = tickets?.map((ticket) => {
    return ticket.petrol_station;
  });

  const users = petrolStations?.length
    ? await services.User.getSelect(petrolStations)
    : [];

  return InlineKeyboard.from(
    chunk(
      users.map(({ user_name: userName, id }) => ({
        text: userName,
        callback_data: selectPetrolStationCreateTicketData.pack({
          id,
        }),
      })),
      2,
    ),
  );
};
