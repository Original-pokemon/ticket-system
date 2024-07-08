import {
  selectConsiderPetrolStationData,
  selectConsiderTicketData,
} from "#root/bot/callback-data/index.js";
import { TicketStatus, UserGroup } from "#root/bot/const/index.js";

import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
import { TicketType } from "#root/services/index.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";

const filterPerStatus = (tickets: TicketType[], status: TicketStatus) => {
  return tickets.filter((ticket) => ticket.status_id === status);
};

export const createFilteredTicketsKeyboard = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const {
    services,
    callbackQuery: { data },
    session: {
      user: { user_group: userGroup, id: userId },
    },
    logger,
  } = ctx;

  const { id: stationId, status } =
    selectConsiderPetrolStationData.unpack(data);

  try {
    const { tickets: ticketIds } =
      await services.PetrolStation.getUnique(stationId);

    let filteredTickets;

    if (userGroup === UserGroup.Manager) {
      const tickets = await services.Ticket.getSelect(ticketIds || []);
      filteredTickets = filterPerStatus(tickets, status as TicketStatus);
    }

    if (userGroup === UserGroup.TaskPerformer) {
      const { tickets: ticketsPerTaskPerformer } =
        await services.TaskPerformer.getUnique(userId);

      const tickets = await services.Ticket.getSelect(
        ticketsPerTaskPerformer || [],
      );

      filteredTickets = filterPerStatus(tickets, status as TicketStatus);
    }

    if (!filteredTickets) throw new Error("No tickets found");

    return InlineKeyboard.from(
      chunk(
        filteredTickets.map(({ title, id }) => {
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
  } catch (error) {
    logger.error(`Failed to create filtered tickets keyboard: ${error}`);
    throw error;
  }
};
