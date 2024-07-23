import { Context } from "#root/bot/context.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";
import {
  selectTicketData,
  transferTicketData,
} from "#root/bot/callback-data/index.js";
import { TicketStatus, UserGroup, UserText } from "#root/bot/const/index.js";
import { TicketType } from "#root/services/index.js";
import { sendManagers } from "#root/bot/helpers/index.js";
import { createPhotosGroup, getTicketProfileData } from "./index.js";

type Properties = {
  ctx: Context;
  ticket: TicketType;
};

const createInlineKeyboard = ({
  ticketId,
  status,
}: {
  ticketId: string;
  status: string;
}) => {
  return InlineKeyboard.from([
    [
      {
        text: "Посмотреть заявку",
        callback_data: selectTicketData.pack({ id: ticketId, status }),
      },
    ],
  ]);
};

const sendAdmins = async ({ ctx, ticket: { id: ticketId } }: Properties) => {
  const { users } = await ctx.services.Group.getUnique(UserGroup.Admin);

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
        await ctx.api.sendMediaGroup(
          userId,
          createPhotosGroup(descriptionAttachmentPaths),
        );
      }

      await ctx.api.sendMessage(userId, profile);
    } catch (error) {
      ctx.logger.error(`Failed to send message to admin ${userId}`, error);
    }
  });

  await Promise.all(promises);
};

const sendManagersNotificationAboutNewTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const {
    id: ticketId,
    title,
    status_id: status,
    petrol_station_id: petrolStationId,
  } = ticket;

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }

  const { user_name: userName } =
    await ctx.services.User.getUnique(petrolStationId);

  const markup = createInlineKeyboard({ ticketId, status });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.Notification.NEW_TICKET({ title, petrolStation: userName }),
    markup,
  );
};

const sendTaskPerformers = async ({ ctx, ticket }: Properties) => {
  const {
    ticket_category: categoryId,
    ticket_priority: priorityId,
    status_id: status,
    id: ticketId,
    petrol_station_id: petrolStationId,
    title,
  } = ticket;

  if (!categoryId || !priorityId) {
    await ctx.reply(UserText.Notification.WITHOUT_CATEGORY);
    throw new Error("Category or Priority not found");
  }

  const { user_name: userName } =
    await ctx.services.User.getUnique(petrolStationId);

  const { task_performers: TaskPerformerIds } =
    await ctx.services.Category.getUnique(categoryId.toString());

  const text = UserText.Notification.NEW_TICKET({
    title,
    petrolStation: userName,
  });

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }
  const markup = createInlineKeyboard({ ticketId, status });

  const promises = TaskPerformerIds.map(async (taskPerformerId) => {
    try {
      await ctx.api.sendMessage(taskPerformerId, text, {
        reply_markup: markup,
      });
    } catch (error) {
      ctx.logger.error(
        `Failed to send message to task performer ${taskPerformerId}: ${error}`,
      );
    }
  });

  await Promise.all(promises);
};

const sendManagersNotificationAboutPerformTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const {
    id: ticketId,
    title,
    status_id: status,
    petrol_station_id: petrolStationId,
  } = ticket;

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }
  const { user_name: userName } =
    await ctx.services.User.getUnique(petrolStationId);

  const markup = createInlineKeyboard({ ticketId, status });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.Notification.PERFORMED({ title, petrolStation: userName }),
    markup,
  );
};

const sendManagersNotificationAboutCompletedTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const {
    id: ticketId,
    title,
    status_id: status,
    petrol_station_id: petrolStationId,
  } = ticket;

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }

  const { user_name: userName } =
    await ctx.services.User.getUnique(petrolStationId);

  const markup = createInlineKeyboard({ ticketId, status });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.Notification.COMPILED_TICKET({ title, petrolStation: userName }),
    markup,
  );
};

const deleteTicket = async () => {};

const actionForCreatedTicket = async ({ ctx, ticket }: Properties) => {
  if (!ticket.id) throw new Error("Ticket Id not found");

  const updatedTicket = await ctx.services.Ticket.updateTicketStatus({
    userId: ctx.session.user.id,
    ticketId: ticket.id,
    statusId: TicketStatus.ReviewedManager,
  });
  await sendManagersNotificationAboutNewTicket({ ctx, ticket: updatedTicket });
};

const actionForReviewedManagerTicket = async ({ ctx, ticket }: Properties) => {
  if (!ticket.id) throw new Error("Ticket Id not found");

  const updatedTicket = await ctx.services.Ticket.updateTicketStatus({
    userId: ctx.session.user.id,
    ticketId: ticket.id,
    statusId: TicketStatus.ReviewedTaskPerformer,
  });
  await sendTaskPerformers({ ctx, ticket: updatedTicket }); // я отправляю задачу со старым статусом
  await sendAdmins({ ctx, ticket });
};

/* 
  Т.к данный статус меняется при просмотре задачи на seenTaskPerformer в handlers\user\select-ticket.ts
  Никакой преедачи не производится
*/
const actionForReviewedTaskPerformerTicket = async () => {
  throw new Error("Not implemented");
};

const actionForSeenTaskPerformer = async ({ ctx, ticket }: Properties) => {
  if (!ticket.id) throw new Error("Ticket Id not found");

  const updatedTicket = await ctx.services.Ticket.update({
    ...ticket,
    status_id: TicketStatus.Performed,
    status_history: [
      {
        user_id: ctx.session.user.id,
        ticket_status: TicketStatus.Performed,
      },
    ],
  });

  await sendManagersNotificationAboutPerformTicket({
    ctx,
    ticket: updatedTicket,
  });
};

const actionForPerformedTicket = async ({ ctx, ticket }: Properties) => {
  if (!ticket.id) throw new Error("Ticket Id not found");

  const updatedTicket = await ctx.services.Ticket.updateTicketStatus({
    userId: ctx.session.user.id,
    ticketId: ticket.id,
    statusId: TicketStatus.Completed,
  });

  await sendManagersNotificationAboutCompletedTicket({
    ctx,
    ticket: updatedTicket,
  });
};

// логика обновления статуса тикета для передачи задачи по конвееру
const statusActions = {
  [TicketStatus.Created]: actionForCreatedTicket,
  [TicketStatus.ReviewedManager]: actionForReviewedManagerTicket,
  [TicketStatus.ReviewedTaskPerformer]: actionForReviewedTaskPerformerTicket,
  [TicketStatus.SeenTaskPerformer]: actionForSeenTaskPerformer,
  [TicketStatus.Performed]: actionForPerformedTicket,
  [TicketStatus.Completed]: deleteTicket,
};

/*
  Данная фукнция отвечает за передачу задачи по конвееру
  и уведомление заинтерисованных лиц
*/
export const transferTicketHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { id } = transferTicketData.unpack(ctx.callbackQuery.data);
  const ticket = await ctx.services.Ticket.getUnique(id);
  try {
    await statusActions[ticket.status_id as TicketStatus]({ ctx, ticket });

    await ctx.editMessageText(UserText.Notification.STATUS_EDIT(ticket.title));
  } catch (error) {
    ctx.logger.info(error);
  }
};
