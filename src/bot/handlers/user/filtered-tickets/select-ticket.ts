import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";
import {
  ticketProfilePanelManager,
  considerTicketProfilePanelTaskPerformer,
  performedTicketProfileTaskPerformer,
} from "#root/bot/keyboards/index.js";
import { selectConsiderTicketData } from "#root/bot/callback-data/index.js";
import { TicketStatus } from "#root/bot/const/index.js";

import { viewTicketProfile } from "../view-ticket-profile.js";

type KeyboardStatusType =
  | TicketStatus.ReviewedManager
  | TicketStatus.ReviewedTaskPerformer
  | TicketStatus.Performed;

const getKeyboard = {
  [TicketStatus.ReviewedManager]: ticketProfilePanelManager,
  [TicketStatus.ReviewedTaskPerformer]: considerTicketProfilePanelTaskPerformer,
  [TicketStatus.Performed]: performedTicketProfileTaskPerformer,
};

export const showFilteredTicketHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { callbackQuery } = ctx;
  const { id: ticketId, status } = selectConsiderTicketData.unpack(
    callbackQuery.data,
  );

  if (!(status in getKeyboard)) {
    throw new Error("Invalid or unsupported ticket status");
  }

  const inlineKeyboard = getKeyboard[status as KeyboardStatusType];

  await viewTicketProfile({
    ctx,
    ticketId,
    inlineKeyboard: inlineKeyboard(ticketId),
  });
};
