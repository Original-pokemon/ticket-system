import { Context } from "#root/bot/context.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";
import {
  selectTicketData,
  sendTicketData,
} from "#root/bot/callback-data/index.js";
import { TicketStatus, UserGroup, UserText } from "#root/bot/const/index.js";
import { TicketType } from "#root/services/index.js";
import { createPhotosGroup, getTicketProfileData } from "./index.js";

type Properties = {
  ctx: Context;
  ticket: TicketType;
};

const createInlineKeyboard = (ticketId: string) => {
  return InlineKeyboard.from([
    [
      {
        text: "Посмотреть заявку",
        callback_data: selectTicketData.pack({ id: ticketId }),
      },
    ],
  ]);
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
    try {
      await ctx.api.sendMessage(managerId, text, { reply_markup: markup });
    } catch (error) {
      ctx.logger.error(
        `Failed to send message to manager ${managerId}: ${error}`,
      );
    }
  });

  await Promise.all(promises);
};

const sendAdmins = async (ctx: Context, ticketId: string) => {
  const { users } = await ctx.services.Group.getUnique(UserGroup.Admin);

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

const updateTicketStatus = async (
  ctx: Context,
  ticket: TicketType,
  statusId: TicketStatus,
) => {
  await ctx.services.Ticket.update({
    ...ticket,
    status_id: statusId,
    status_history: [
      {
        user_id: ctx.session.user.id,
        ticket_status: statusId,
      },
    ],
  });
};

const sendManagersNotificationAboutNewTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const { id: ticketId, title } = ticket;

  await updateTicketStatus(ctx, ticket, TicketStatus.ReviewedManager);

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }

  const markup = createInlineKeyboard(ticketId);

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

  await updateTicketStatus(ctx, ticket, TicketStatus.ReviewedTaskPerformer);

  const text = UserText.SendTicket.NEW_TICKET(title);

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }
  const markup = createInlineKeyboard(ticketId);

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
  await sendAdmins(ctx, ticketId);
};

const sendManagersNotificationAboutPerformTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const { id: ticketId, title } = ticket;

  if (!ticketId) {
    throw new Error("Ticket Id not found");
  }

  const markup = createInlineKeyboard(ticketId);

  await updateTicketStatus(ctx, ticket, TicketStatus.Performed);

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

  const markup = createInlineKeyboard(ticketId);

  await updateTicketStatus(ctx, ticket, TicketStatus.Completed);

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
    // TODO: добавить отдельную функцию для обновления статуса, которая будет вызываться в этой функции

    await statusActions[ticket.status_id as TicketStatus]({ ctx, ticket });
    await ctx.editMessageText(UserText.SendTicket.STATUS_EDIT);
  } catch (error) {
    ctx.logger.info(error);
  }
};
