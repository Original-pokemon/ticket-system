import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";
import { sendTicketData } from "#root/bot/callback-data/index.js";
import { TicketStatus, UserText } from "#root/bot/const/index.js";
import { TicketType } from "#root/services/index.js";

type Properties = {
  ctx: Context;
  ticket: TicketType;
};

const sendManagers = async ({ ctx, ticket }: Properties, text: string) => {
  const { petrol_station_id: petrolStationId } = ticket;
  const { managers } =
    await ctx.services.PetrolStation.getUnique(petrolStationId);

  if (!managers) {
    throw new Error("Managers not found");
  }

  const promises = managers.map(async (managerId) => {
    await ctx.api.sendMessage(managerId, text);
  });

  Promise.all(promises);
};

const sendManagersNotificationAboutNewTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  await ctx.services.Ticket.update({
    ...ticket,
    user_id: ctx.session.user.id,
    status_id: TicketStatus.ReviewedManager,
  });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.SendTicket.NEW_TICKET(ticket.title),
  );
};

const sendTaskPerformers = async ({ ctx, ticket }: Properties) => {
  const {
    ticket_category: categoryId,
    ticket_priority: priorityId,
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
    user_id: ctx.session.user.id,
    status_id: TicketStatus.ReviewedTaskPerformer,
  });

  const promises = TaskPerformerIds.map(async (taskPerformerId) => {
    await ctx.api.sendMessage(
      taskPerformerId,
      UserText.SendTicket.NEW_TICKET(title),
    );
  });

  await Promise.all(promises);
};

const sendManagersNotificationAboutPerformTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  await ctx.services.Ticket.update({
    ...ticket,
    user_id: ctx.session.user.id,
    status_id: TicketStatus.Performed,
  });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.SendTicket.PERFORMED(ticket.title),
  );
};

const sendManagersNotificationAboutCompletedTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  await ctx.services.Ticket.update({
    ...ticket,
    user_id: ctx.session.user.id,
    status_id: TicketStatus.Completed,
  });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.SendTicket.COMPILED_TICKET(ticket.title),
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
