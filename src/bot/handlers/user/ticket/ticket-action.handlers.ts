import { Context } from "#root/bot/context.js";
import { CallbackQueryContext, InlineKeyboard, HearsContext } from "grammy";
import {
  ticketProfilePanelManager,
  considerTicketProfilePanelTaskPerformer,
  performedTicketProfileTaskPerformer,
  createReviewTaskCompletionKeyboard,
  createWithdrawTicketKeyboard,
  createTicketNotificationKeyboard,
} from "#root/bot/keyboards/index.js";
import {
  selectTicketData,
  retrieveTicketData,
} from "#root/bot/callback-data/index.js";
import { TicketStatus, UserGroup, UserText } from "#root/bot/const/index.js";

import { sendManagers, sendTaskPerformers } from "#root/bot/helpers/index.js";

import { TicketType } from "#root/types/index.js";
import { CREATE_TICKET_CONVERSATION } from "#root/bot/conversations/create-ticket/create-ticket.js";
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

type Properties = {
  ctx: Context;
  ticket: TicketType;
};

const sendManagersNotificationAboutRetrieveTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  if (!ticket.id) {
    throw new Error("Ticket Id not found");
  }

  if (ticket.status_id === TicketStatus.SeenTaskPerformer) {
    const statusId = TicketStatus.ReviewedManager;

    const updatedTicket = await ctx.services.Ticket.update({
      ...ticket,
      // eslint-disable-next-line unicorn/no-null
      ticket_category: null,
      status_id: statusId,
      status_history: [
        {
          user_id: ctx.session.user.id,
          ticket_status: statusId,
        },
      ],
    });

    const markup = createTicketNotificationKeyboard({
      ticketId: ticket.id,
      status: statusId,
    });

    await sendManagers(
      {
        ctx,
        ticket: updatedTicket,
      },
      UserText.RETRIEVE_TICKET(ticket.title),
      markup,
    );
  } else {
    await ctx.editMessageText(UserText.Notification.ERROR_USER_GROUP);

    throw new Error("Ticket status is not correct");
  }
};

const sendTaskPerformerNotificationAboutRetrieveTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  if (!ticket.id) {
    throw new Error("Ticket Id not found");
  }
  if (ticket.status_id === TicketStatus.WaitingConfirmation) {
    const statusId = TicketStatus.ReviewedTaskPerformer;

    const updatedTicket = await ctx.services.Ticket.updateTicketStatus({
      statusId,
      ticketId: ticket.id,
      userId: ctx.session.user.id,
    });

    const markup = createTicketNotificationKeyboard({
      ticketId: ticket.id,
      status: statusId,
    });

    sendTaskPerformers(
      { ctx, ticket: updatedTicket },
      UserText.RETRIEVE_TICKET(ticket.title),
      markup,
    );
  } else {
    await ctx.editMessageText(UserText.Notification.ERROR_USER_GROUP);

    throw new Error("Ticket status is not correct");
  }
};

const Action = {
  [UserGroup.TaskPerformer]: sendManagersNotificationAboutRetrieveTicket,
  [UserGroup.Manager]: sendTaskPerformerNotificationAboutRetrieveTicket,
};

export const retrieveTicketHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const {
    services,
    callbackQuery: { data },
    session: {
      user: { user_group: userGroup },
    },
  } = ctx;
  const { id } = retrieveTicketData.unpack(data);
  const ticket = await services.Ticket.getUnique(id);

  if (
    userGroup !== UserGroup.TaskPerformer &&
    userGroup !== UserGroup.Manager
  ) {
    throw new Error("User group not supported");
  }
  await Action[userGroup]({ ctx, ticket });

  await ctx.editMessageText(UserText.RETRIEVE_TICKET(ticket.title));
};

export const createTicketHandler = async (ctx: HearsContext<Context>) => {
  await ctx.conversation.enter(CREATE_TICKET_CONVERSATION);
};
