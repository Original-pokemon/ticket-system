import { InlineKeyboard } from "grammy";
import { TicketType } from "#root/types/index.js";
import { Context } from "../context.js";

type Properties = {
  ctx: Context;
  ticket: TicketType;
};

export const sendManagers = async (
  { ctx, ticket }: Properties,
  text: string,
  markup?: InlineKeyboard,
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

export const sendTaskPerformers = async (
  { ctx, ticket }: Properties,
  text: string,
  markup?: InlineKeyboard,
) => {
  const { session, api, logger, services } = ctx;
  const { ticket_category: categoryId } = ticket;

  if (!categoryId) {
    throw new Error("Category not found");
  }

  if (!session?.categories) {
    throw new Error("Category not found in session");
  }

  const { task_performers: taskPerformerIds } =
    await services.Category.getUnique(categoryId);

  const promises = taskPerformerIds.map(async (taskPerformerId) => {
    try {
      await api.sendMessage(taskPerformerId, text, {
        reply_markup: markup,
      });
    } catch (error) {
      logger.error(
        `Failed to send message to task performer ${taskPerformerId}: ${error}`,
      );
    }
  });

  await Promise.all(promises);
};
