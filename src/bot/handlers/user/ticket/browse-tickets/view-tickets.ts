import {
  selectTicketsData,
  selectTicketData,
} from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";
import {
  addBackButton,
  getPageKeyboard,
  paginateItems,
} from "#root/bot/helpers/index.js";
import { TicketType } from "#root/types/index.js";
import { TicketStatus, UserGroup, UserText } from "#root/bot/const/index.js";
import { getAllTicketsForUserGroup } from "./get-all-tickets-for-user-group.js";

const filterPerStatus = (tickets: TicketType[], statuses: TicketStatus[]) => {
  return tickets.filter((ticket) =>
    statuses.includes(ticket.status_id as TicketStatus),
  );
};

const filterPerPetrolStation = (tickets: TicketType[], stationId: string) => {
  return tickets.filter((ticket) => ticket.petrol_station_id === stationId);
};

const createFilteredTicketsKeyboard = async (
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
  const callbackData = selectTicketsData.unpack(data);
  const { selectPetrolStationId, selectStatusId, pageIndex, pageSize } =
    callbackData;

  try {
    const tickets = await getAllTicketsForUserGroup(userGroup as UserGroup, {
      ctx,
      services,
      userId,
    });
    const filteredTickets = filterPerStatus(
      filterPerPetrolStation(tickets, selectPetrolStationId),
      [selectStatusId as TicketStatus],
    );

    if (filteredTickets.length === 0) throw new Error("No tickets found");

    const ticketsPages = paginateItems(filteredTickets, pageSize);

    const pageItems = ticketsPages[pageIndex].map(({ title, id }) => {
      if (!id) throw new Error("Invalid ticket id");

      return {
        text: title,
        callback_data: selectTicketData.pack({
          id,
        }),
      };
    });

    const keyboard = getPageKeyboard(
      pageItems,
      pageIndex,
      ticketsPages.length,
      selectTicketsData,
      {
        selectStatusId,
        isSelectPetrolStation: true,
        selectPetrolStationId,
        pageSize,
      },
    );

    return addBackButton(
      keyboard,
      selectTicketsData.pack({
        selectStatusId,
        pageIndex: 0,
        isSelectPetrolStation: false,
        selectPetrolStationId,
        pageSize,
      }),
    );
  } catch (error) {
    logger.error(`Failed to create filtered tickets keyboard: ${error}`);
    throw error;
  }
};

export const showTicketsFilteredHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  await ctx.editMessageText(UserText.Consider.TICKETS, {
    reply_markup: await createFilteredTicketsKeyboard(ctx),
  });
};
