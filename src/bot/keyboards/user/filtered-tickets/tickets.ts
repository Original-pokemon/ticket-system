import {
  selectConsiderPetrolStationData,
  selectTicketData,
  showPetrolStationsData,
} from "#root/bot/callback-data/index.js";

import { TicketStatus, UserGroup } from "#root/bot/const/index.js";

import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
import { ServicesType } from "#root/container.js";
import { TicketType } from "#root/types/index.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";

const filterPerStatus = (tickets: TicketType[], statuses: TicketStatus[]) => {
  return tickets.filter((ticket) =>
    statuses.includes(ticket.status_id as TicketStatus),
  );
};

const filterPerPetrolStation = (tickets: TicketType[], stationId: string) => {
  return tickets.filter((ticket) => ticket.petrol_station_id === stationId);
};

const getUserTickets = {
  [UserGroup.Manager]: async (services: ServicesType, stationId: string) => {
    const { tickets } = await services.PetrolStation.getUnique(stationId);
    return tickets || [];
  },
  [UserGroup.TaskPerformer]: async (services: ServicesType, userId: string) => {
    const { tickets } = await services.TaskPerformer.getUnique(userId);
    return tickets || [];
  },
  [UserGroup.Supervisor]: async (services: ServicesType, stationId: string) => {
    const { tickets } = await services.PetrolStation.getUnique(stationId);
    return tickets || [];
  },
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

  const { id: stationId, statuses: statusesString } =
    selectConsiderPetrolStationData.unpack(data);

  const statuses = statusesString.split(",") as TicketStatus[];

  try {
    let tickets: TicketType[] = [];

    if (userGroup in getUserTickets) {
      const id = userGroup === UserGroup.TaskPerformer ? userId : stationId;

      tickets = await getUserTickets[userGroup as keyof typeof getUserTickets](
        services,
        id,
      );
    } else {
      throw new Error("Unsupported user group");
    }

    const filteredTickets = filterPerStatus(
      filterPerPetrolStation(tickets, stationId),
      statuses,
    );

    if (filteredTickets.length === 0) throw new Error("No tickets found");

    const keyboardRows = InlineKeyboard.from(
      chunk(
        filteredTickets.map(({ title, id, status_id: status }) => {
          if (!id) throw new Error("Invalid ticket id");

          return {
            text: title,
            callback_data: selectTicketData.pack({
              id,
              status,
            }),
          };
        }),
        2,
      ),
    );

    keyboardRows.row().add({
      text: "Назад",
      callback_data: showPetrolStationsData.pack({ status: statusesString }),
    });

    return keyboardRows;
  } catch (error) {
    logger.error(`Failed to create filtered tickets keyboard: ${error}`);
    throw error;
  }
};
