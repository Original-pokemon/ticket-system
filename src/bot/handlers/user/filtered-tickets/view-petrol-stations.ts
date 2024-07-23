import { showPetrolStationsData } from "#root/bot/callback-data/index.js";
import {
  ManagerButtons,
  TaskPerformerButtons,
  TicketStatus,
  UserText,
} from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { createFilteredPetrolStationsKeyboard } from "#root/bot/keyboards/index.js";
import { CallbackQueryContext } from "grammy";

type HearsTextType =
  | ManagerButtons.ConsiderTickets
  | TaskPerformerButtons.ConsiderTickets
  | TaskPerformerButtons.TicketsForPerformance;

const Status = {
  [ManagerButtons.ConsiderTickets]: [TicketStatus.ReviewedManager],
  [TaskPerformerButtons.ConsiderTickets]: [
    TicketStatus.SeenTaskPerformer,
    TicketStatus.ReviewedTaskPerformer,
  ],
  [TaskPerformerButtons.TicketsForPerformance]: [TicketStatus.Performed],
};

export const viewPetrolStationsFilteredHandler = async (
  ctx: Context | CallbackQueryContext<Context>,
) => {
  let status;

  if (ctx.message?.text) {
    status = Status[ctx.message?.text as HearsTextType];
  }

  if (ctx.callbackQuery?.data) {
    const callbackData = showPetrolStationsData.unpack(ctx.callbackQuery.data);
    status = callbackData.status.split(",") as TicketStatus[];
  }
  if (!status) {
    throw new Error("Status not found");
  }
  await ctx.reply(UserText.Consider.PETROL_STATIONS, {
    reply_markup: await createFilteredPetrolStationsKeyboard(ctx, status),
  });
};
