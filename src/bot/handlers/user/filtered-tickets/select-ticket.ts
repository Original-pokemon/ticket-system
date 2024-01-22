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
  const { services, callbackQuery } = ctx;
  const { id, status } = selectConsiderTicketData.unpack(callbackQuery.data);

  const ticket = await services.Ticket.getUnique(id);

  if (!(status in getKeyboard)) {
    throw new Error("Invalid or unsupported ticket status");
  }

  const inlineKeyboard = getKeyboard[status as KeyboardStatusType];

  await viewTicketProfile({
    ctx,
    ticket,
    inlineKeyboard: inlineKeyboard(id),
  });
};
