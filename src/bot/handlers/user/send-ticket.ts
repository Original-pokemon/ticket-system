import { Context } from "#root/bot/context.ts";
import { CallbackQueryContext } from "grammy";
import { sendTicketData } from "#root/bot/callback-data/index.ts";
import { TicketStatus, UserText } from "#root/bot/const/index.ts";
import { TicketType } from "#root/services/index.ts";

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
  const text = "";

  await ctx.services.Ticket.update({
    ...ticket,
    status_id: TicketStatus.Created,
  });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    text,
  );
};

const sendTaskPerformers = async ({ ctx, ticket }: Properties) => {
  const { ticket_category: categoryId } = ticket;

  if (!categoryId) {
    throw new Error("Category not found");
  }

  const { task_performers: TaskPerformerIds } =
    await ctx.services.Category.getUnique(categoryId.toString());

  await ctx.services.Ticket.update({
    ...ticket,
    status_id: TicketStatus.ReviewedTaskPerformer,
  });

  const promises = TaskPerformerIds.map(async (taskPerformerId) => {
    await ctx.api.sendMessage(taskPerformerId, UserText.SendTicket.NEW_TICKET);
  });

  await Promise.all(promises);
};

const sendManagersNotificationAboutPerformTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  await ctx.services.Ticket.update({
    ...ticket,
    status_id: TicketStatus.Performed,
  });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    UserText.SendTicket.PERFORMED,
  );
};

const sendManagersNotificationAboutCompletedTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  const text = "completedTicket";
  await ctx.services.Ticket.update({
    ...ticket,
    status_id: TicketStatus.Completed,
  });

  await sendManagers(
    {
      ctx,
      ticket,
    },
    text,
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

  await statusActions[ticket.status_id as TicketStatus]({ ctx, ticket });

  await ctx.editMessageText(UserText.SendTicket.STATUS_EDIT);
};
