import {
  SelectTicketScene,
  selectTicketsData,
} from "#root/bot/callback-data/index.js";
import { TicketStatus, UserGroup } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";
import {
  addBackButton,
  getPageKeyboard,
  paginateItems,
} from "#root/bot/helpers/index.js";
import { getAllTicketsForUserGroup } from "./get-all-tickets-for-user-group.js";

const PAGE_SIZE = 20;

const createFilteredPetrolStationsKeyboard = async (
  ctx: CallbackQueryContext<Context>,
  statuses: TicketStatus[],
) => {
  const { services, session, callbackQuery } = ctx;
  const {
    user: { id: userId, user_group: userGroup },
  } = session;

  const {
    pageIndex,
    selectStatusId,
    selectPetrolStationId,
    availableStatuses,
  } = selectTicketsData.unpack(callbackQuery.data);

  const tickets = await getAllTicketsForUserGroup(userGroup as UserGroup, {
    ctx,
    services,
    userId,
  });

  const filteredTickets = tickets?.filter((ticket) =>
    statuses.includes(ticket.status_id as TicketStatus),
  );

  if (!filteredTickets || filteredTickets.length === 0) {
    throw new Error("Tickets not found");
  }

  const stationCountMap = new Map<string, number>();
  // eslint-disable-next-line no-restricted-syntax
  for (const t of filteredTickets) {
    const stId = t.petrol_station_id;
    stationCountMap.set(stId, (stationCountMap.get(stId) ?? 0) + 1);
  }

  const uniqueStations = [...stationCountMap.keys()];
  const users = await services.User.getSelect(uniqueStations || []);

  const usersPages = paginateItems(users, PAGE_SIZE);

  if (users.length === 0) {
    throw new Error("Tickets not found");
  }

  const pageItems = usersPages[pageIndex].map(({ user_name: userName, id }) => {
    const count = stationCountMap.get(id) ?? 0;
    const text = `${userName} (${count})`;
    return {
      text,
      callback_data: selectTicketsData.pack({
        availableStatuses,
        scene: SelectTicketScene.Ticket,
        selectStatusId: statuses[0],
        selectPetrolStationId: id,
        pageIndex: 0,
      }),
    };
  });

  const keyboard = getPageKeyboard(
    pageItems,
    pageIndex,
    usersPages.length,
    selectTicketsData,
    {
      scene: SelectTicketScene.PetrolStation,
      availableStatuses,
      selectStatusId,
      selectPetrolStationId,
    },
  );

  return addBackButton(
    keyboard,
    selectTicketsData.pack({
      scene: SelectTicketScene.Status,
      availableStatuses,
      selectStatusId,
      selectPetrolStationId,
      pageIndex: 0,
    }),
  );
};

export const viewPetrolStationsFilteredHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const {
    session: {
      statuses: { data: cachedStatuses },
    },
    callbackQuery,
  } = ctx;
  const { selectStatusId } = selectTicketsData.unpack(callbackQuery?.data);

  if (!cachedStatuses) {
    throw new Error("Statuses not found");
  }

  const keyboard = await createFilteredPetrolStationsKeyboard(ctx, [
    selectStatusId as TicketStatus,
  ]);

  try {
    await ctx.editMessageText(
      `Отфильтрованные АЗС для статуса ${cachedStatuses[selectStatusId].description}`,
      {
        reply_markup: keyboard,
      },
    );
  } catch {
    await ctx.reply(
      `Отфильтрованные АЗС для статуса ${cachedStatuses[selectStatusId].description}`,
      {
        reply_markup: keyboard,
      },
    );
  }
};
