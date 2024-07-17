import {
  selectTicketData,
  selectPetrolStationData,
} from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";

function convertArrayToDictionary(
  array: { petrol_station: string; tickets: string[] }[],
): Map<string, string[]> {
  const dictionary = new Map();

  for (let index = 0; index < array.length; index += 1)
    dictionary.set(array[index].petrol_station, array[index].tickets);

  return dictionary;
}

export const createTicketsPerPetrolStationKeyboard = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const {
    services,
    session,
    callbackQuery: { data },
  } = ctx;
  const { id: stationId } = selectPetrolStationData.unpack(data);

  const { user } = session;
  const { tickets: ticketsPerStations } = await services.Manager.getUnique(
    user.id,
  );

  const ticketsPerStationsMap =
    ticketsPerStations && convertArrayToDictionary(ticketsPerStations);

  const ticketIds = ticketsPerStationsMap?.get(stationId) || [];

  const tickets = await services.Ticket.getSelect(ticketIds);

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
