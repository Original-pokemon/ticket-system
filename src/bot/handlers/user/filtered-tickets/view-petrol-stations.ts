import { showPetrolStationsData } from "#root/bot/callback-data/index.js";
import {
  ManagerButtons,
  PetrolStationButtons,
  TaskPerformerButtons,
  TicketStatus,
  UserGroup,
  UserText,
} from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { createFilteredPetrolStationsKeyboard } from "#root/bot/keyboards/index.js";
import { CallbackQueryContext } from "grammy";

type HearsTextType =
  | ManagerButtons.ConsiderTickets
  | TaskPerformerButtons.ConsiderTickets
  | TaskPerformerButtons.TicketsForPerformance;

const AllStatus = Object.values(TicketStatus);

const unsupportedButton = () => {
  throw new Error("unsupported button");
};

const getStatuses = {
  [UserGroup.Manager]: {
    [ManagerButtons.ConsiderTickets]: [TicketStatus.ReviewedManager],
    [ManagerButtons.AllTickets]: AllStatus,
    [TaskPerformerButtons.ConsiderTickets]: unsupportedButton,
    [TaskPerformerButtons.TicketsForPerformance]: unsupportedButton,
    [PetrolStationButtons.AllTickets]: unsupportedButton,
  },
  [UserGroup.TaskPerformer]: {
    [TaskPerformerButtons.ConsiderTickets]: [
      TicketStatus.SeenTaskPerformer,
      TicketStatus.ReviewedTaskPerformer,
    ],
    [TaskPerformerButtons.TicketsForPerformance]: [TicketStatus.Performed],
    [ManagerButtons.ConsiderTickets]: unsupportedButton,
    [ManagerButtons.AllTickets]: unsupportedButton,
    [PetrolStationButtons.AllTickets]: unsupportedButton,
  },
};

export const viewPetrolStationsFilteredHandler = async (
  ctx: Context | CallbackQueryContext<Context>,
) => {
  const {
    session: {
      user: { user_group: userGroup },
    },
    message,
    callbackQuery,
  } = ctx;

  let statuses;

  if (message?.text && userGroup in getStatuses) {
    const userGroupStatuses =
      getStatuses[userGroup as keyof typeof getStatuses];
    const getStatusFunction = userGroupStatuses[message.text as HearsTextType];
    if (typeof getStatusFunction === "function") {
      getStatusFunction(); // throw error if not found
    } else {
      statuses = getStatusFunction;
    }
  }

  // to return from task selection (manager or task performer)
  if (callbackQuery?.data) {
    await ctx.deleteMessage();
    const callbackData = showPetrolStationsData.unpack(callbackQuery.data);
    statuses = callbackData.status.split(",") as TicketStatus[];
  }
  if (!statuses) {
    throw new Error("Status not found");
  }

  try {
    await ctx.reply(UserText.Consider.PETROL_STATIONS, {
      reply_markup: await createFilteredPetrolStationsKeyboard(ctx, statuses),
    });
  } catch {
    await ctx.reply("Задачи не найдены");
  }
};
