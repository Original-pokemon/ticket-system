import { selectTicketsData } from "#root/bot/callback-data/index.js";
import { TicketStatus, UserGroup } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { chunk } from "#root/bot/helpers/index.js";
import { getAllTicketsForUserGroup } from "./get-all-tickets-for-user-group.js";

const createFilteredPetrolStationsKeyboard = async (
  ctx: Context,
  statuses: TicketStatus[],
) => {
  const { services, session } = ctx;
  const {
    user: { id: userId, user_group: userGroup },
  } = session;

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

  if (users.length === 0) {
    throw new Error("Tickets not found");
  }

  const buttons = users.map(({ user_name: userName, id }) => {
    const count = stationCountMap.get(id) ?? 0;
    const text = `${userName} (${count})`;
    return {
      text,
      callback_data: selectTicketsData.pack({
        selectStatusId: statuses[0],
        isSelectPetrolStation: true,
        selectPetrolStationId: id,
      }),
    };
  });

  const keyboardRows = chunk(buttons, 2);

  return InlineKeyboard.from(keyboardRows);
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

  try {
    await ctx.editMessageText(
      `Отфильтрованные АЗС для статуса ${cachedStatuses[selectStatusId].description}`,
      {
        reply_markup: await createFilteredPetrolStationsKeyboard(ctx, [
          selectStatusId as TicketStatus,
        ]),
      },
    );
  } catch {
    await ctx.reply(
      `Отфильтрованные АЗС для статуса ${cachedStatuses[selectStatusId].description}`,
      {
        reply_markup: await createFilteredPetrolStationsKeyboard(ctx, [
          selectStatusId as TicketStatus,
        ]),
      },
    );
  }
};
