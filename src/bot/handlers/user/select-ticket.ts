import { Context } from "#root/bot/context.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";
import {
  ticketProfilePanelManager,
  considerTicketProfilePanelTaskPerformer,
  performedTicketProfileTaskPerformer,
} from "#root/bot/keyboards/index.js";
import { selectTicketData } from "#root/bot/callback-data/index.js";
import { TicketStatus, UserGroup } from "#root/bot/const/index.js";

import { viewTicketProfile } from "./view-ticket-profile.js";

const TaskPerformerStatus = {
  [TicketStatus.Created]: () => {
    throw new Error("unsupported ticket status");
  },
  [TicketStatus.ReviewedManager]: () => {
    throw new Error("unsupported ticket status");
  },
  [TicketStatus.ReviewedTaskPerformer]: (ticketId: string) =>
    considerTicketProfilePanelTaskPerformer(ticketId),
  [TicketStatus.Performed]: performedTicketProfileTaskPerformer,
  [TicketStatus.Completed]: () => new InlineKeyboard(),
};

const ManagerStatus = {
  [TicketStatus.Created]: () => new InlineKeyboard(),
  [TicketStatus.ReviewedManager]: (ticketId: string) =>
    ticketProfilePanelManager(ticketId),
  [TicketStatus.ReviewedTaskPerformer]: () => new InlineKeyboard(),
  [TicketStatus.Performed]: () => new InlineKeyboard(),
  [TicketStatus.Completed]: () => new InlineKeyboard(),
};

const PetrolStationStatus = {
  [TicketStatus.Created]: () => new InlineKeyboard(),
  [TicketStatus.ReviewedManager]: () => new InlineKeyboard(),
  [TicketStatus.ReviewedTaskPerformer]: () => new InlineKeyboard(),
  [TicketStatus.Performed]: () => new InlineKeyboard(),
  [TicketStatus.Completed]: () => new InlineKeyboard(),
};

const getKeyboard = {
  [UserGroup.Manager]: ManagerStatus,
  [UserGroup.TaskPerformer]: TaskPerformerStatus,
  [UserGroup.PetrolStation]: PetrolStationStatus,
};

type KeyboardGroupType = keyof typeof getKeyboard;

export const showTicketHandler = async (ctx: CallbackQueryContext<Context>) => {
  const {
    callbackQuery,
    session: {
      user: { user_group: userGroup },
    },
  } = ctx;
  const { id: ticketId, status } = selectTicketData.unpack(callbackQuery.data);

  if (!(userGroup in getKeyboard)) {
    throw new Error("Invalid or unsupported ticket status");
  }

  const inlineKeyboard =
    getKeyboard[userGroup as KeyboardGroupType][status as TicketStatus](
      ticketId,
    );

  await viewTicketProfile({
    ctx,
    ticketId,
    inlineKeyboard,
  });
};
