import { selectPetrolStationData } from "#root/bot/callback-data/index.ts";
import { Context } from "#root/bot/context.ts";
import { chunk } from "#root/bot/helpers/index.ts";
import { InlineKeyboard } from "grammy";

export const createPetrolStationsKeyboard = async (ctx: Context) => {
  const { services, session } = ctx;
  const { user } = session;
  const { ticket: tickets } = await services.Manager.getUnique(user.id);
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
        callback_data: selectPetrolStationData.pack({
          id,
        }),
      })),
      2,
    ),
  );
};
