/* eslint-disable no-restricted-syntax */
import { CallbackQueryContext, HearsContext, InlineKeyboard } from "grammy";
import { Context } from "#root/bot/context.js";
import { SupervisorButtons, UserGroup } from "#root/bot/const/index.js";
import { selectTicketsData } from "#root/bot/callback-data/index.js";
import { chunk } from "#root/bot/helpers/index.js";
import {
  getAllowedStatusesForUserGroup,
  HearsTextType,
} from "./get-allowed-statuses-for-user-group.js";
import { getAllTicketsForUserGroup } from "./get-all-tickets-for-user-group.js";

const createStatusSectionKeyboard = async (
  ctx: HearsContext<Context> | CallbackQueryContext<Context>,
) => {
  const {
    user,
    statuses: { data: cachedStatuses },
  } = ctx.session;
  const { user_group: userGroup, id: userId } = user;

  if (!cachedStatuses) {
    throw new Error("Statuses not found ");
  }

  let buttonText = ctx.message?.text as HearsTextType | undefined;

  if (!buttonText) {
    buttonText = SupervisorButtons.AllTickets;
  }

  const allowedStatuses = getAllowedStatusesForUserGroup(
    userGroup as UserGroup,
    buttonText,
  );

  const tickets = await getAllTicketsForUserGroup(userGroup as UserGroup, {
    ctx,
    services: ctx.services,
    userId,
  });

  const statusCountMap = new Map<string, number>();
  // eslint-disable-next-line no-restricted-syntax
  for (const t of tickets) {
    const st = t.status_id;
    statusCountMap.set(st, (statusCountMap.get(st) ?? 0) + 1);
  }

  const keyboard = InlineKeyboard.from(
    chunk(
      allowedStatuses.map((status) => {
        const desc = cachedStatuses[status]?.description ?? status;
        const count = statusCountMap.get(status) ?? 0;
        return {
          text: count > 0 ? `${desc} (${count})` : `${desc} (0)`,
          callback_data:
            count > 0
              ? selectTicketsData.pack({
                  selectStatusId: status,
                  isSelectPetrolStation: false,
                  selectPetrolStationId: "",
                  pageIndex: 0,
                  pageSize: 20,
                })
              : "ignore",
        };
      }),
      1,
    ),
  );

  return keyboard;
};

export async function viewStatusSectionHandler(
  ctx: HearsContext<Context> | CallbackQueryContext<Context>,
) {
  const {
    statuses: { data: cachedStatuses },
  } = ctx.session;

  if (!cachedStatuses) {
    throw new Error("cachedStatuses not found");
  }

  const text = "Выберите интересующий Вас статус заявки";

  try {
    await ctx.editMessageText(text, {
      reply_markup: await createStatusSectionKeyboard(ctx),
    });
  } catch {
    await ctx.reply(text, {
      reply_markup: await createStatusSectionKeyboard(ctx),
    });
  }
}
