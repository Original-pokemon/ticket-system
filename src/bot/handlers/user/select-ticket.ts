import { Context } from "#root/bot/context.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";
import {
  ticketProfilePanelManager,
  considerTicketProfilePanelTaskPerformer,
  performedTicketProfileTaskPerformer,
  createReviewTaskCompletionKeyboard,
  createWithdrawTicketKeyboard,
} from "#root/bot/keyboards/index.js";
import { selectTicketData } from "#root/bot/callback-data/index.js";
import { TicketStatus, UserGroup, UserText } from "#root/bot/const/index.js";

import { sendManagers } from "#root/bot/helpers/index.js";

import { TicketType } from "#root/services/index.js";
import { viewTicketProfile } from "./view-ticket-profile.js";

const handleTaskPerformerView = async ({
  ctx,
  ticket,
}: {
  ctx: Context;
  ticket: TicketType;
}) => {
  const { title, petrol_station_id: petrolStationId, id: ticketId } = ticket;

  const { user_name: userName } =
    await ctx.services.User.getUnique(petrolStationId);

  if (!ticketId) {
    throw new Error("Ticket id not found");
  }

  await ctx.services.Ticket.updateTicketStatus({
    userId: ctx.session.user.id,
    ticketId,
    statusId: TicketStatus.SeenTaskPerformer,
  });

  await sendManagers(
    { ctx, ticket },
    UserText.Notification.SEEN_TICKET({ title, petrolStation: userName }),
  );
};

const TaskPerformerStatus = {
  [TicketStatus.Created]: () => {
    throw new Error("unsupported ticket status");
  },
  [TicketStatus.ReviewedManager]: () => {
    throw new Error("unsupported ticket status");
  },
  [TicketStatus.ReviewedTaskPerformer]: (ticketId: string) =>
    considerTicketProfilePanelTaskPerformer(ticketId),
  [TicketStatus.SeenTaskPerformer]: (ticketId: string) =>
    considerTicketProfilePanelTaskPerformer(ticketId),
  [TicketStatus.Performed]: (ticketId: string) =>
    performedTicketProfileTaskPerformer(ticketId),
  [TicketStatus.WaitingConfirmation]: () => {
    throw new Error("unsupported ticket status");
  },
  [TicketStatus.Completed]: () => new InlineKeyboard(),
};

const ManagerStatus = {
  [TicketStatus.Created]: (ticketId: string) =>
    ticketProfilePanelManager(ticketId),
  [TicketStatus.ReviewedManager]: (ticketId: string) =>
    ticketProfilePanelManager(ticketId),
  [TicketStatus.ReviewedTaskPerformer]: (ticketId: string) =>
    createWithdrawTicketKeyboard(ticketId),
  [TicketStatus.SeenTaskPerformer]: () => new InlineKeyboard(),
  [TicketStatus.Performed]: () => new InlineKeyboard(),
  [TicketStatus.WaitingConfirmation]: (ticketId: string) =>
    createReviewTaskCompletionKeyboard(ticketId),
  [TicketStatus.Completed]: () => new InlineKeyboard(),
};

const PetrolStationStatus = {
  [TicketStatus.Created]: () => new InlineKeyboard(),
  [TicketStatus.ReviewedManager]: () => new InlineKeyboard(),
  [TicketStatus.ReviewedTaskPerformer]: () => new InlineKeyboard(),
  [TicketStatus.SeenTaskPerformer]: () => new InlineKeyboard(),
  [TicketStatus.Performed]: () => new InlineKeyboard(),
  [TicketStatus.WaitingConfirmation]: () => new InlineKeyboard(),
  [TicketStatus.Completed]: () => new InlineKeyboard(),
};

const getKeyboard = {
  [UserGroup.Manager]: ManagerStatus,
  [UserGroup.TaskPerformer]: TaskPerformerStatus,
  [UserGroup.PetrolStation]: PetrolStationStatus,
  [UserGroup.Admin]: PetrolStationStatus,
  [UserGroup.Supervisor]: PetrolStationStatus,
};

type KeyboardGroupType = keyof typeof getKeyboard;

export const showTicketHandler = async (ctx: CallbackQueryContext<Context>) => {
  const {
    callbackQuery,
    session: {
      user: { user_group: userGroup },
    },
    services,
  } = ctx;
  const { id: ticketId } = selectTicketData.unpack(callbackQuery.data);

  const ticket = await services.Ticket.getUnique(ticketId);

  if (!(userGroup in getKeyboard)) {
    throw new Error("Invalid or unsupported ticket status");
  }

  if (!ticketId) {
    throw new Error("Ticket id not found");
  }

  const inlineKeyboard =
    getKeyboard[userGroup as KeyboardGroupType][
      ticket.status_id as TicketStatus
    ](ticketId);

  await viewTicketProfile({
    ctx,
    ticketId,
    inlineKeyboard,
  });

  if (
    userGroup === UserGroup.TaskPerformer &&
    ticket.status_id === TicketStatus.ReviewedTaskPerformer
  ) {
    await handleTaskPerformerView({
      ctx,
      ticket,
    });
  }
};
