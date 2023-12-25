import {
  selectConsiderPetrolStationData,
  selectConsiderTicketData,
} from "#root/bot/callback-data/index.ts";

import { TicketStatus } from "#root/bot/const/index.ts";
import { Context } from "#root/bot/context.ts";
import { chunk } from "#root/bot/helpers/index.ts";
import { CallbackQueryContext, InlineKeyboard } from "grammy";

function convertArrayToDictionary(
  array: { petrol_station: string; ticket: string[] }[],
): Map<string, string[]> {
  const dictionary = new Map();

  for (let index = 0; index < array.length; index += 1)
    dictionary.set(array[index].petrol_station, array[index].ticket);

  return dictionary;
}

export const createFilteredTicketsPerPetrolStationKeyboard = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const {
    services,
    session,
    callbackQuery: { data },
  } = ctx;
  const { id: stationId } = selectConsiderPetrolStationData.unpack(data);

  const { user } = session;
  const { ticket: ticketsPerStations } = await services.Manager.getUnique(
    user.id,
  );

  const ticketsPerStationsMap =
    ticketsPerStations && convertArrayToDictionary(ticketsPerStations);

  const ticketIds = ticketsPerStationsMap?.get(stationId) || [];

  const tickets = await services.Ticket.getSelect(ticketIds);
  const ticketsFilteredPerStatus = tickets.filter(
    (ticket) => ticket.status_id === TicketStatus.ReviewedManager,
  );

  return InlineKeyboard.from(
    chunk(
      ticketsFilteredPerStatus.map(({ title, id }) => {
        if (!id) throw new Error("Invalid ticket id");

        return {
          text: title,
          callback_data: selectConsiderTicketData.pack({
            id,
          }),
        };
      }),
      1,
    ),
  );
};
