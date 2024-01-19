import {
  selectConsiderPetrolStationData,
  selectConsiderTicketData,
} from "#root/bot/callback-data/index.ts";

import { Context } from "#root/bot/context.ts";
import { chunk } from "#root/bot/helpers/index.ts";
import { CallbackQueryContext, InlineKeyboard } from "grammy";

export const createFilteredTicketsKeyboard = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const {
    services,
    callbackQuery: { data },
  } = ctx;
  const { id: stationId, status } =
    selectConsiderPetrolStationData.unpack(data);

  const { ticket: ticketIds } =
    await services.PetrolStation.getUnique(stationId);

  const ticketsInfo = await services.Ticket.getSelect(ticketIds || []);

  const ticketsFilteredPerStatus = ticketsInfo.filter(
    (ticket) => ticket.status_id === status,
  );

  return InlineKeyboard.from(
    chunk(
      ticketsFilteredPerStatus.map(({ title, id }) => {
        if (!id) throw new Error("Invalid ticket id");

        return {
          text: title,
          callback_data: selectConsiderTicketData.pack({
            id,
            status,
          }),
        };
      }),
      1,
    ),
  );
};
