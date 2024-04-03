import { Context } from "#root/bot/context.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";
import {
  selectTicketData,
  sendTicketData,
} from "#root/bot/callback-data/index.js";
import { TicketStatus, UserGroup, UserText } from "#root/bot/const/index.js";
import { TicketType } from "#root/services/index.js";

type Properties = {
  ctx: Context;
  ticket: TicketType;
};

const sendManagers = async (
  { ctx, ticket }: Properties,
  text: string,
  markup: InlineKeyboard,
) => {
  const { petrol_station_id: petrolStationId } = ticket;
  const { managers } =
    await ctx.services.PetrolStation.getUnique(petrolStationId);

  if (!managers) {
    throw new Error("Managers not found");
  }

  const promises = managers.map(async (managerId) => {
    await ctx.api.sendMessage(managerId, text, { reply_markup: markup });
  });

  await Promise.all(promises);
};

const sendAdmins = async (
  ctx: Context,
  text: string,
  markup: InlineKeyboard,
) => {
  const { users } = await ctx.services.Group.getUnique(UserGroup.Admin);

  if (!users) {
    throw new Error("Admins not found");
  }

  const promises = users.map(async (userId) => {
    await ctx.api.sendMessage(userId, text, { reply_markup: markup });
  });

  await Promise.all(promises);
};

const sendManagersNotificationAboutNewTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const { id: ticketId, title } = ticket;

  await ctx.services.Ticket.update({
    ...ticket,
    status_id: TicketStatus.ReviewedManager,
    status_history: [
      {
        user_id: ctx.session.user.id,
        ticket_status: TicketStatus.ReviewedManager,
      },
    ],
  });

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }

  const markup = InlineKeyboard.from([
    [
      {
        text: "Посмотреть заявку",
        callback_data: selectTicketData.pack({ id: ticketId }),
      },
    ],
  ]);

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.SendTicket.NEW_TICKET(title),
    markup,
  );
};

const sendTaskPerformers = async ({ ctx, ticket }: Properties) => {
  const {
    ticket_category: categoryId,
    ticket_priority: priorityId,
    id: ticketId,
    title,
  } = ticket;

  if (!categoryId || !priorityId) {
    await ctx.reply(UserText.SendTicket.WITHOUT_CATEGORY);
    throw new Error("Category or Priority not found");
  }

  const { task_performers: TaskPerformerIds } =
    await ctx.services.Category.getUnique(categoryId.toString());

  await ctx.services.Ticket.update({
    ...ticket,
    status_id: TicketStatus.ReviewedTaskPerformer,
    status_history: [
      {
        user_id: ctx.session.user.id,
        ticket_status: TicketStatus.ReviewedTaskPerformer,
      },
    ],
  });

  const text = UserText.SendTicket.NEW_TICKET(title);

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }
  const markup = InlineKeyboard.from([
    [
      {
        text: "Посмотреть заявку",
        callback_data: selectTicketData.pack({ id: ticketId }),
      },
    ],
  ]);

  const promises = TaskPerformerIds.map(async (taskPerformerId) => {
    await ctx.api.sendMessage(taskPerformerId, text, { reply_markup: markup });
  });

  await Promise.all(promises);
  await sendAdmins(ctx, text, markup);
};

const sendManagersNotificationAboutPerformTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const { id: ticketId, title } = ticket;

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }

  const markup = InlineKeyboard.from([
    [
      {
        text: "Посмотреть заявку",
        callback_data: selectTicketData.pack({ id: ticketId }),
      },
    ],
  ]);

  await ctx.services.Ticket.update({
    ...ticket,
    status_id: TicketStatus.Performed,
    status_history: [
      {
        user_id: ctx.session.user.id,
        ticket_status: TicketStatus.Performed,
      },
    ],
  });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.SendTicket.PERFORMED(title),
    markup,
  );
};

const sendManagersNotificationAboutCompletedTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const { id: ticketId, title } = ticket;

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }

  const markup = InlineKeyboard.from([
    [
      {
        text: "Посмотреть заявку",
        callback_data: selectTicketData.pack({ id: ticketId }),
      },
    ],
  ]);

  await ctx.services.Ticket.update({
    ...ticket,
    status_id: TicketStatus.Completed,
    status_history: [
      {
        user_id: ctx.session.user.id,
        ticket_status: TicketStatus.Completed,
      },
    ],
  });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.SendTicket.COMPILED_TICKET(title),
    markup,
  );
};

const deleteTicket = async () => {};

const statusActions = {
  [TicketStatus.Created]: sendManagersNotificationAboutNewTicket,
  [TicketStatus.ReviewedManager]: sendTaskPerformers,
  [TicketStatus.ReviewedTaskPerformer]:
    sendManagersNotificationAboutPerformTicket,
  [TicketStatus.Performed]: sendManagersNotificationAboutCompletedTicket,
  [TicketStatus.Completed]: deleteTicket,
};

export const sendTicketHandler = async (ctx: CallbackQueryContext<Context>) => {
  const { id } = sendTicketData.unpack(ctx.callbackQuery.data);
  const ticket = await ctx.services.Ticket.getUnique(id);
  try {
    await statusActions[ticket.status_id as TicketStatus]({ ctx, ticket });
    await ctx.editMessageText(UserText.SendTicket.STATUS_EDIT);
  } catch (error) {
    ctx.logger.info(error);
  }
};
