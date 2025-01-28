import { selectTicketData } from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
import { ManagerType, PetrolStationType } from "#root/types/index.js";
import { InlineKeyboard } from "grammy";

export const createAllTicketsKeyboard = async (ctx: Context) => {
  const { services, session } = ctx;

  const { user } = session;
  const { petrol_stations: petrolStations } = (await services.Manager.getUnique(
    user.id,
  )) as ManagerType & { petrol_stations: PetrolStationType[] };

  if (!petrolStations) {
    throw new Error("Petrol stations not found");
  }

  const tickets = petrolStations.flatMap(
    ({ tickets: petrolStationTickets }) => petrolStationTickets || [],
  );

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
