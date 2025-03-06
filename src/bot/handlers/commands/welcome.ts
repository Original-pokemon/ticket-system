import { Context } from "#root/bot/context.js";
import { CommandContext, InlineKeyboard } from "grammy";
import { createAdminStartMenu } from "#root/bot/keyboards/admin/admin-panel.js";
import { isBlocked, isUnauthorized } from "#root/bot/filters/index.js";
import { isAdmin } from "#root/bot/filters/is-bot-admin.js";
import { BotText } from "#root/bot/const/text.js";
import { createUserKeyboard } from "#root/bot/keyboards/index.js";
import {
  commandsText,
  TicketStatus,
  ManagerButtons,
  UserText,
  UserGroup,
} from "#root/bot/const/index.js";
import { getAllTicketsForUserGroup } from "#root/bot/handlers/user/ticket/browse-tickets/get-all-tickets-for-user-group.js";
import { groupStatusesMap } from "#root/bot/handlers/user/ticket/browse-tickets/group-statuses-map.js";
import { TicketType } from "#root/types/index.js";
import {
  selectTicketsData,
  selectTicketData,
  SelectTicketScene,
} from "#root/bot/callback-data/index.js";
import {
  addBackButton,
  getPageKeyboard,
  paginateItems,
} from "#root/bot/helpers/index.js";

const filterPerStatus = (tickets: TicketType[], statuses: TicketStatus[]) => {
  return tickets.filter((ticket) =>
    statuses.includes(ticket.status_id as TicketStatus),
  );
};

const filterPerPetrolStation = (tickets: TicketType[], stationId: string) => {
  return tickets.filter((ticket) => ticket.petrol_station_id === stationId);
};

const PAGE_SIZE = 20;

const getFilteredTicketsKeyboard = async (
  ctx: CommandContext<Context>,
  userGroup: UserGroup,
  userId: string,
  stationId: string,
  statusId: string,
): Promise<InlineKeyboard | undefined> => {
  const { services, logger } = ctx;

  try {
    // Получаем все задачи для группы пользователя
    const tickets = await getAllTicketsForUserGroup(userGroup, {
      ctx,
      services,
      userId,
    });

    // Определяем статусы для фильтрации
    let statusesToFilter: TicketStatus[];

    try {
      statusesToFilter = statusId
        ? [statusId as TicketStatus]
        : groupStatusesMap[
            (userGroup as UserGroup.Manager) || UserGroup.TaskPerformer
          ][ManagerButtons.AllTickets];
    } catch (error) {
      logger.error(`Failed to get statuses: ${error}`);
      return undefined;
    }

    // Фильтруем задачи по stationId и статусам
    const filteredTickets = filterPerStatus(
      filterPerPetrolStation(tickets, stationId),
      statusesToFilter,
    );

    if (filteredTickets.length === 0) {
      return undefined;
    }

    const ticketsPages = paginateItems(filteredTickets, PAGE_SIZE);

    const pageItems = ticketsPages[0].map(({ title, id }) => {
      if (!id) throw new Error("Invalid ticket id");

      return {
        text: title,
        callback_data: selectTicketData.pack({
          id,
        }),
      };
    });

    const availableStatuses = statusesToFilter.join(",");

    const keyboard = getPageKeyboard(
      pageItems,
      0,
      ticketsPages.length,
      selectTicketsData,
      {
        scene: SelectTicketScene.Ticket,
        availableStatuses,
        selectStatusId: statusId,
        selectPetrolStationId: stationId,
      },
    );

    return addBackButton(
      keyboard,
      selectTicketsData.pack({
        scene: SelectTicketScene.PetrolStation,
        availableStatuses,
        selectStatusId: statusId,
        pageIndex: 0,
        selectPetrolStationId: stationId,
      }),
    );
  } catch (error) {
    logger.error(`Failed to get tickets: ${error}`);
    return undefined;
  }
};

export const welcomeCommandHandler = async (ctx: CommandContext<Context>) => {
  const { session, conversation, msg, logger } = ctx;
  const {
    user: { user_group: userGroup, id: userId },
    groups: { data: cachedGroups },
  } = session;
  const [stationId, statusId] = msg.text.split(" ")[1]?.split("-") || [];

  if (stationId) {
    try {
      const keyboard = await getFilteredTicketsKeyboard(
        ctx,
        userGroup,
        userId,
        stationId,
        statusId,
      );

      if (!keyboard) {
        await ctx.reply("Задачи не найдены");
        return;
      }

      await ctx.reply(UserText.Consider.TICKETS, {
        reply_markup: keyboard,
      });
    } catch (error) {
      logger.error(`Failed to get tickets: ${error}`);
      await ctx.reply("Произошла ошибка при получении задач");
    }
    return;
  }

  if (!cachedGroups) {
    throw new Error("Gropes not found");
  }
  const group = cachedGroups[userGroup];

  await conversation.exit();

  if (isAdmin(userGroup)) {
    try {
      await ctx.editMessageText(BotText.Welcome.ADMIN, {
        reply_markup: createAdminStartMenu(),
      });
      return;
    } catch {
      return ctx.reply(BotText.Welcome.ADMIN, {
        reply_markup: createAdminStartMenu(),
      });
    }
  }
  if (isUnauthorized(userGroup)) {
    return ctx.reply(BotText.Welcome.UNAUTHORIZED);
  }

  if (isBlocked(userGroup)) {
    return ctx.reply(BotText.Welcome.BLOCKED);
  }

  return ctx.reply(
    BotText.Welcome.getUserText(group.description, Object.values(commandsText)),
    {
      reply_markup: await createUserKeyboard(group.id),
    },
  );
};
