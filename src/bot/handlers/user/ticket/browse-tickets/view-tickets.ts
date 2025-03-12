import {
  selectTicketsData,
  selectTicketData,
  SelectTicketScene,
} from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";
import {
  addBackButton,
  getPageKeyboard,
  paginateItems,
} from "#root/bot/helpers/index.js";
import { TicketType } from "#root/types/index.js";
import {
  TicketStatus,
  UserGroup,
  UserText,
  ManagerButtons,
} from "#root/bot/const/index.js";
import { infoPageCallback } from "#root/bot/handlers/index.js";
import { getAllTicketsForUserGroup } from "./get-all-tickets-for-user-group.js";
import { groupStatusesMap } from "./group-statuses-map.js";

const filterPerStatus = (tickets: TicketType[], statuses: TicketStatus[]) => {
  return tickets.filter((ticket) =>
    statuses.includes(ticket.status_id as TicketStatus),
  );
};

const filterPerPetrolStation = (tickets: TicketType[], stationId: string) => {
  return tickets.filter((ticket) => ticket.petrol_station_id === stationId);
};

const PAGE_SIZE = 20;

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
  const {
    selectPetrolStationId,
    selectStatusId,
    pageIndex,
    availableStatuses,
  } = callbackData;

  try {
    const tickets = await getAllTicketsForUserGroup(userGroup as UserGroup, {
      ctx,
      services,
      userId,
    });

    // Проверяем, что selectStatusId не пустой, иначе используем все доступные статусы
    let statusIdToUse = selectStatusId;

    if (!statusIdToUse) {
      // Если статус не указан, используем все доступные статусы
      statusIdToUse = availableStatuses;
    }

    // Определяем статусы для фильтрации
    let statusesToFilter: TicketStatus[];

    // Если statusIdToUse - строка, проверяем на наличие разделителя или маркер ALL
    if (typeof statusIdToUse === "string") {
      if (statusIdToUse === "ALL") {
        // Используем все доступные статусы
        statusesToFilter =
          groupStatusesMap[
            (userGroup as UserGroup.Manager) || UserGroup.TaskPerformer
          ][ManagerButtons.AllTickets];
      } else if (statusIdToUse.includes("_")) {
        // Разбиваем строку статусов на массив
        statusesToFilter = statusIdToUse
          .split("_")
          .map((status) => status.trim() as TicketStatus);
      } else {
        // Один статус
        statusesToFilter = [statusIdToUse as TicketStatus];
      }
    } else if (Array.isArray(statusIdToUse)) {
      // Если statusIdToUse уже массив (из availableStatuses)
      statusesToFilter = statusIdToUse as TicketStatus[];
    } else {
      throw new TypeError("Invalid status format");
    }

    const filteredTickets = filterPerStatus(
      filterPerPetrolStation(tickets, selectPetrolStationId),
      statusesToFilter,
    );

    if (filteredTickets.length === 0) throw new Error("No tickets found");

    const ticketsPages = paginateItems(filteredTickets, PAGE_SIZE);

    const pageItems = ticketsPages[pageIndex].map(({ title, id }) => {
      if (!id) throw new Error("Invalid ticket id");

      return {
        text: title,
        callback_data: selectTicketData.pack({
          id,
        }),
      };
    });

    // Используем маркер "ALL" для всех статусов, чтобы уменьшить размер callback данных
    const useAllMarker = statusesToFilter.length > 2;
    const selectStatusIdValue = useAllMarker
      ? "ALL"
      : statusesToFilter.join("_");

    // Для availableStatuses используем только первые 3 статуса, чтобы уменьшить размер данных
    const availableStatusesValue =
      groupStatusesMap[
        (userGroup as UserGroup.Manager) || UserGroup.TaskPerformer
      ][ManagerButtons.AllTickets].join(",");

    const keyboard = getPageKeyboard(
      pageItems,
      pageIndex,
      ticketsPages.length,
      selectTicketsData,
      {
        scene: SelectTicketScene.Ticket,
        availableStatuses: availableStatusesValue,
        selectStatusId: selectStatusIdValue,
        selectPetrolStationId,
      },
    );

    if (useAllMarker) {
      return addBackButton(
        keyboard,
        infoPageCallback.pack({
          pageIndex: 0,
        }),
      );
    }

    return addBackButton(
      keyboard,
      selectTicketsData.pack({
        scene: SelectTicketScene.PetrolStation,
        availableStatuses: availableStatusesValue,
        selectStatusId: selectStatusIdValue,
        pageIndex: 0,
        selectPetrolStationId,
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
