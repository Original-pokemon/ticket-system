import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";
import { transferTicketData } from "#root/bot/callback-data/index.js";
import { TicketStatus, UserGroup, UserText } from "#root/bot/const/index.js";
import { TicketType } from "#root/types/index.js";
import { sendManagers, sendTaskPerformers } from "#root/bot/helpers/index.js";
import formatDateString from "#root/bot/helpers/format-date.js";
import { createTicketNotificationKeyboard } from "#root/bot/keyboards/index.js";
import { isManager, isTaskPerformer } from "#root/bot/filters/is-user.js";
import { createPhotosGroup, getTicketProfileData } from "../index.js";

type Properties = {
  ctx: Context;
  ticket: TicketType;
};

const sendAdmins = async ({ ctx, ticket: { id: ticketId } }: Properties) => {
  const { api, services, logger } = ctx;
  const { users } = await services.Group.getUnique(UserGroup.Admin);

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }

  if (!users) {
    throw new Error("Admins not found");
  }

  const { profile, descriptionAttachmentPaths } = await getTicketProfileData({
    ctx,
    ticketId,
  });

  const promises = users.map(async (userId) => {
    try {
      if (descriptionAttachmentPaths.length > 0) {
        await api.sendMediaGroup(
          userId,
          createPhotosGroup(descriptionAttachmentPaths),
        );
      }

      await api.sendMessage(userId, profile);
    } catch (error) {
      logger.error(`Failed to send message to admin ${userId}`, error);
    }
  });

  await Promise.all(promises);
};

const sendSupervisors = async ({
  ctx,
  ticket: { id: ticketId },
}: Properties) => {
  const { api, services, logger } = ctx;
  const { users } = await services.Group.getUnique(UserGroup.Supervisor);

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }

  if (!users) {
    throw new Error("Admins not found");
  }

  const { profile, descriptionAttachmentPaths } = await getTicketProfileData({
    ctx,
    ticketId,
  });

  const promises = users.map(async (userId) => {
    try {
      if (descriptionAttachmentPaths.length > 0) {
        await api.sendMediaGroup(
          userId,
          createPhotosGroup(descriptionAttachmentPaths),
        );
      }

      await api.sendMessage(userId, profile);
    } catch (error) {
      logger.error(`Failed to send message to admin ${userId}`, error);
    }
  });

  await Promise.all(promises);
};

const sendManagersNotificationAboutNewTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const { id: ticketId, title, petrol_station_id: petrolStationId } = ticket;

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }

  const { user_name: userName } =
    await ctx.services.User.getUnique(petrolStationId);

  const markup = createTicketNotificationKeyboard({ ticketId });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.Notification.NEW_TICKET({ title, petrolStation: userName }),
    markup,
  );
};

const sendTaskPerformersAboutNewTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const { id: ticketId, petrol_station_id: petrolStationId, title } = ticket;

  const { user_name: userName } =
    await ctx.services.User.getUnique(petrolStationId);

  const text = UserText.Notification.NEW_TICKET({
    title,
    petrolStation: userName,
  });

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }
  const markup = createTicketNotificationKeyboard({ ticketId });

  sendTaskPerformers({ ctx, ticket }, text, markup);
};

const sendManagersNotificationAboutPerformTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const {
    id: ticketId,
    title,
    petrol_station_id: petrolStationId,
    deadline,
  } = ticket;

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }

  if (!deadline) {
    throw new Error("Deadline not found");
  }

  const { user_name: userName } =
    await ctx.services.User.getUnique(petrolStationId);

  const markup = createTicketNotificationKeyboard({ ticketId });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.Notification.PERFORMED({
      title,
      petrolStation: userName,
      deadline: formatDateString(deadline),
    }),
    markup,
  );
};

const sendManagersNotificationAboutCompletedTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const { id: ticketId, title, petrol_station_id: petrolStationId } = ticket;

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }

  const { user_name: userName } =
    await ctx.services.User.getUnique(petrolStationId);

  const markup = createTicketNotificationKeyboard({ ticketId });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.Notification.WAITING_CONFIRM({ title, petrolStation: userName }),
    markup,
  );
};

const sendTaskPerformersNotificationAboutCompletedTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const { id: ticketId, title, petrol_station_id: petrolStationId } = ticket;

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }

  const { user_name: userName } =
    await ctx.services.User.getUnique(petrolStationId);

  const markup = createTicketNotificationKeyboard({ ticketId });

  await sendTaskPerformers(
    {
      ctx,
      ticket,
    },
    UserText.Notification.COMPLIED({ title, petrolStation: userName }),
    markup,
  );
};

const deleteTicket = async ({ ticket }: Properties) => ticket;

const actionForCreatedTicket = async ({ ctx, ticket }: Properties) => {
  if (!ticket.id) throw new Error("Ticket Id not found");

  const updatedTicket = await ctx.services.Ticket.updateTicketStatus({
    userId: ctx.session.user.id,
    ticketId: ticket.id,
    statusId: TicketStatus.ReviewedManager,
  });

  await sendManagersNotificationAboutNewTicket({ ctx, ticket: updatedTicket });

  return updatedTicket;
};

const actionForReviewedManagerTicket = async ({ ctx, ticket }: Properties) => {
  const { user } = ctx.session;
  const { id, ticket_category: ticketCategory } = ticket;

  if (isManager(user.user_group)) {
    if (!id) throw new Error("Ticket Id not found");
    if (!ticketCategory) {
      await ctx.reply(UserText.Notification.WITHOUT_CATEGORY);
      throw new Error("Category not found");
    }

    const updatedTicket = await ctx.services.Ticket.updateTicketStatus({
      userId: user.id,
      ticketId: id,
      statusId: TicketStatus.ReviewedTaskPerformer,
    });
    await sendTaskPerformersAboutNewTicket({ ctx, ticket: updatedTicket });
    await sendAdmins({ ctx, ticket });
    await sendSupervisors({ ctx, ticket });

    return updatedTicket;
  }
  await ctx.editMessageText(UserText.Notification.ERROR_USER_GROUP);

  throw new Error("User group is not manager");
};

/* 
  Т.к данный статус меняется при просмотре задачи на seenTaskPerformer в handlers\user\select-ticket.ts
  Никакой преедачи не производится
*/
const actionForReviewedTaskPerformerTicket = async ({ ctx }: Properties) => {
  await ctx.deleteMessage();

  throw new Error("Not implemented");
};

const actionForSeenTaskPerformer = async ({ ctx, ticket }: Properties) => {
  const { user, customData } = ctx.session;
  const { deadline } = customData;
  if (!ticket.id) throw new Error("Ticket Id not found");

  if (isTaskPerformer(user.user_group)) {
    if (!deadline) {
      throw new Error("Deadline not found");
    }
    const updatedTicket = await ctx.services.Ticket.update({
      ...ticket,
      deadline: new Date(deadline).toISOString(),
      status_id: TicketStatus.Performed,
      status_history: [
        {
          user_id: user.id,
          ticket_status: TicketStatus.Performed,
        },
      ],
    });

    await sendManagersNotificationAboutPerformTicket({
      ctx,
      ticket: updatedTicket,
    });

    return updatedTicket;
  }
  await ctx.editMessageText(UserText.Notification.ERROR_USER_GROUP);

  throw new Error("User group is not manager");
};

const actionForPerformedTicket = async ({ ctx, ticket }: Properties) => {
  const { user } = ctx.session;
  if (!ticket.id) throw new Error("Ticket Id not found");

  if (isTaskPerformer(user.user_group)) {
    const updatedTicket = await ctx.services.Ticket.updateTicketStatus({
      userId: user.id,
      ticketId: ticket.id,
      statusId: TicketStatus.WaitingConfirmation,
    });

    await sendManagersNotificationAboutCompletedTicket({
      ctx,
      ticket: updatedTicket,
    });

    return updatedTicket;
  }
  await ctx.editMessageText(UserText.Notification.ERROR_USER_GROUP);

  throw new Error("User group is not manager");
};

const actionForConfirmTask = async ({ ctx, ticket }: Properties) => {
  const { user } = ctx.session;
  if (!ticket.id) throw new Error("Ticket Id not found");

  if (isManager(user.user_group)) {
    const updatedTicket = await ctx.services.Ticket.updateTicketStatus({
      userId: user.id,
      ticketId: ticket.id,
      statusId: TicketStatus.Completed,
    });

    await sendTaskPerformersNotificationAboutCompletedTicket({
      ctx,
      ticket: updatedTicket,
    });

    return updatedTicket;
  }
  await ctx.editMessageText(UserText.Notification.ERROR_USER_GROUP);

  throw new Error("User group is not manager");
};

// логика обновления статуса тикета для передачи задачи по конвееру
const statusActions = {
  [TicketStatus.Created]: actionForCreatedTicket,
  [TicketStatus.ReviewedManager]: actionForReviewedManagerTicket,
  [TicketStatus.ReviewedTaskPerformer]: actionForReviewedTaskPerformerTicket,
  [TicketStatus.SeenTaskPerformer]: actionForSeenTaskPerformer,
  [TicketStatus.Performed]: actionForPerformedTicket,
  [TicketStatus.WaitingConfirmation]: actionForConfirmTask,
  [TicketStatus.Completed]: deleteTicket,
};

/*
  Данная фукнция отвечает за передачу задачи по конвееру
  и уведомление заинтерисованных лиц
*/
export const transferTicketHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { data: cachedStatuses } = ctx.session.statuses;
  const { id: ticketId } = transferTicketData.unpack(ctx.callbackQuery.data);
  const ticket = await ctx.services.Ticket.getUnique(ticketId);
  try {
    const { status_id: ticketStatus } = await statusActions[
      ticket.status_id as TicketStatus
    ]({ ctx, ticket });

    if (!cachedStatuses) {
      throw new Error("cachedStatuses not found");
    }

    await ctx.editMessageText(
      UserText.Notification.STATUS_EDIT(
        ticket.title,
        cachedStatuses[ticketStatus].description,
      ),
      {
        reply_markup: createTicketNotificationKeyboard({ ticketId }),
      },
    );
  } catch (error) {
    ctx.logger.info(error);
  }
};
