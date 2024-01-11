import {
  ManagerButtons,
  TaskPerformerButtons,
  TicketStatus,
  UserText,
} from "#root/bot/const/index.ts";
import { Context } from "#root/bot/context.ts";
import { createFilteredPetrolStationsKeyboard } from "#root/bot/keyboards/index.ts";

type HearsTextType =
  | ManagerButtons.ConsiderTickets
  | TaskPerformerButtons.ConsiderTickets
  | TaskPerformerButtons.TicketsForPerformance;

const Status = {
  [ManagerButtons.ConsiderTickets]: TicketStatus.ReviewedManager,
  [TaskPerformerButtons.ConsiderTickets]: TicketStatus.ReviewedTaskPerformer,
  [TaskPerformerButtons.TicketsForPerformance]: TicketStatus.Performed,
};

export const viewPetrolStationsFilteredHandler = async (ctx: Context) => {
  if (!ctx.message?.text) {
    throw new Error("Text not found");
  }

  const status = Status[ctx.message?.text as HearsTextType];

  await ctx.reply(UserText.Consider.PETROL_STATIONS, {
    reply_markup: await createFilteredPetrolStationsKeyboard(ctx, status),
  });
};
