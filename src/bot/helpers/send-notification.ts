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
  const {
    petrol_station_id: petrolStationId,
    id: ticketId,
    title: ticketTitle,
  } = ticket;
  const { logger, services, api } = ctx;

  // Валидация данных тикета
  if (!petrolStationId) {
    logger.error(
      `[sendManagers] Petrol station ID not found for ticket ${ticketId} "${ticketTitle}"`,
    );
    throw new Error("Petrol station ID not found");
  }

  // Получение менеджеров АЗС
  logger.info(
    `[sendManagers] Fetching managers for petrol station ${petrolStationId}, ticket ${ticketId} "${ticketTitle}"`,
  );

  let managers: string[] | undefined;
  try {
    const petrolStation =
      await services.PetrolStation.getUnique(petrolStationId);
    managers = petrolStation.managers;
  } catch (error) {
    logger.error(
      `[sendManagers] Failed to fetch petrol station ${petrolStationId}: ${error}`,
    );
    throw new Error(`Failed to fetch petrol station: ${error}`);
  }

  if (!managers || managers.length === 0) {
    logger.warn(
      `[sendManagers] No managers found for petrol station ${petrolStationId}, ticket ${ticketId} "${ticketTitle}"`,
    );
    throw new Error("Managers not found");
  }

  logger.info(
    `[sendManagers] Sending notifications to ${managers.length} manager(s) for ticket ${ticketId}`,
  );

  // Отправка уведомлений
  let successCount = 0;
  let failureCount = 0;

  const promises = managers.map(async (managerId) => {
    try {
      await api.sendMessage(managerId, text, { reply_markup: markup });
      successCount += 1;
      logger.debug(
        `[sendManagers] Successfully sent notification to manager ${managerId} for ticket ${ticketId}`,
      );
    } catch (error) {
      failureCount += 1;
      logger.error(
        `[sendManagers] Failed to send notification to manager ${managerId} for ticket ${ticketId} "${ticketTitle}": ${error}`,
      );
    }
  });

  await Promise.all(promises);

  // Итоговая статистика
  logger.info(
    `[sendManagers] Notification summary for ticket ${ticketId}: ${successCount} sent successfully, ${failureCount} failed`,
  );

  if (failureCount === managers.length) {
    logger.error(
      `[sendManagers] All notifications failed for ticket ${ticketId} "${ticketTitle}"`,
    );
  }
};

export const sendTaskPerformers = async (
  { ctx, ticket }: Properties,
  text: string,
  markup?: InlineKeyboard,
) => {
  const { session, api, logger, services } = ctx;
  const {
    ticket_category: categoryId,
    id: ticketId,
    title: ticketTitle,
  } = ticket;

  // Валидация данных тикета
  if (!categoryId) {
    logger.error(
      `[sendTaskPerformers] Category ID not found for ticket ${ticketId} "${ticketTitle}"`,
    );
    throw new Error("Category not found");
  }

  if (!session?.categories) {
    logger.error(
      `[sendTaskPerformers] Categories not loaded in session for ticket ${ticketId}`,
    );
    throw new Error("Category not found in session");
  }

  // Получение исполнителей из категории
  logger.info(
    `[sendTaskPerformers] Fetching task performers for category ${categoryId}, ticket ${ticketId} "${ticketTitle}"`,
  );

  let taskPerformerIds: string[] | undefined;
  try {
    const category = await services.Category.getUnique(categoryId);
    taskPerformerIds = category.task_performers;
  } catch (error) {
    logger.error(
      `[sendTaskPerformers] Failed to fetch category ${categoryId}: ${error}`,
    );
    throw new Error(`Failed to fetch category: ${error}`);
  }

  if (!taskPerformerIds || taskPerformerIds.length === 0) {
    logger.warn(
      `[sendTaskPerformers] No task performers found for category ${categoryId}, ticket ${ticketId} "${ticketTitle}"`,
    );
    throw new Error("Not found taskPerformerIds");
  }

  logger.info(
    `[sendTaskPerformers] Sending notifications to ${taskPerformerIds.length} task performer(s) for ticket ${ticketId}`,
  );

  // Отправка уведомлений
  let successCount = 0;
  let failureCount = 0;

  const promises = taskPerformerIds.map(async (taskPerformerId) => {
    try {
      await api.sendMessage(taskPerformerId, text, {
        reply_markup: markup,
      });
      successCount += 1;
      logger.debug(
        `[sendTaskPerformers] Successfully sent notification to task performer ${taskPerformerId} for ticket ${ticketId}`,
      );
    } catch (error) {
      failureCount += 1;
      logger.error(
        `[sendTaskPerformers] Failed to send notification to task performer ${taskPerformerId} for ticket ${ticketId} "${ticketTitle}": ${error}`,
      );
    }
  });

  await Promise.all(promises);

  // Итоговая статистика
  logger.info(
    `[sendTaskPerformers] Notification summary for ticket ${ticketId}: ${successCount} sent successfully, ${failureCount} failed`,
  );

  if (failureCount === taskPerformerIds.length) {
    logger.error(
      `[sendTaskPerformers] All notifications failed for ticket ${ticketId} "${ticketTitle}"`,
    );
  }
};
