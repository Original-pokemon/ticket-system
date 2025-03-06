/* eslint-disable no-restricted-syntax */
import type { Context } from "#root/bot/context.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { createCallbackData } from "callback-data";
import { startMessageCallback } from "#root/bot/callback-data/index.js";
import { addBackButton } from "#root/bot/helpers/index.js";
import { logger } from "#root/logger.js";
import { getAllTicketsForUserGroup } from "../user/ticket/browse-tickets/get-all-tickets-for-user-group.js";

// Создаем callback-data для пагинации информационного сообщения
export const infoPageCallback = createCallbackData("info-page", {
  pageIndex: Number,
});

/**
 * Разбивает текст на страницы по смысловым блокам /AZS_
 * @param text Исходный текст
 * @param blocksPerPage Максимальное количество блоков на странице
 * @returns Массив строк - страниц
 */
export function paginateInfoText(
  text: string,
  blocksPerPage: number,
): string[] {
  if (!text) return ["Заявки не найдены"];

  const blocks = text.split("start_line");
  const pages: string[] = [];
  let currentPage = "";

  for (const block of blocks) {
    if (currentPage.split("\n\n").length - 1 < blocksPerPage) {
      currentPage += block;
    } else {
      pages.push(currentPage);
      currentPage = block;
    }
  }

  pages.push(currentPage);

  return pages;
}

/**
 * Создает клавиатуру для пагинации информационного сообщения
 * @param currentPage Текущая страница
 * @param totalPages Общее количество страниц
 * @returns Клавиатура с кнопками пагинации и кнопкой "назад"
 */
export function getInfoPaginationKeyboard(
  currentPage: number,
  totalPages: number,
): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  if (totalPages > 1) {
    // Добавляем кнопки пагинации только если страниц больше одной
    if (currentPage > 0) {
      keyboard.text(
        "⏮ Пред. страница",
        infoPageCallback.pack({ pageIndex: currentPage - 1 }),
      );
    }

    if (currentPage < totalPages - 1) {
      keyboard.text(
        "След. страница ⏭",
        infoPageCallback.pack({ pageIndex: currentPage + 1 }),
      );
    }

    keyboard.row();
  }

  return addBackButton(keyboard, startMessageCallback.pack({}));
}

export async function infoCallbackHandler(
  ctx: CallbackQueryContext<Context>,
): Promise<void> {
  try {
    const {
      user,
      statuses: { data: cachedStatuses },
    } = ctx.session;
    const { services, callbackQuery } = ctx;

    const { pageIndex } = infoPageCallback.unpack(callbackQuery.data);

    if (!user) {
      throw new Error("Пользователь не найден в сессии");
    }
    if (!cachedStatuses) {
      throw new Error("cachedStatuses did not set");
    }

    const { user_group: userGroup, id: userId } = user;
    const tickets = await getAllTicketsForUserGroup(userGroup, {
      ctx,
      services,
      userId,
    });

    // Группировка заявок по АЗС и статусам с использованием for...of
    const stationMap = new Map<string, Map<string, number>>();
    for (const ticket of tickets) {
      const stationId = ticket.petrol_station_id;
      const statusId = ticket.status_id;
      if (!stationMap.has(stationId)) {
        stationMap.set(stationId, new Map());
      }
      const statusIdMap = stationMap.get(stationId)!;
      statusIdMap.set(statusId, (statusIdMap.get(statusId) || 0) + 1);
    }

    // Получение информации об АЗС для отображения названий
    const uniqueStations = [...stationMap.keys()];
    let stationDetails: { id: string; user_name: string }[] = [];

    try {
      stationDetails = await services.User.getSelect(uniqueStations);
    } catch {
      // Если не удалось получить данные, используем идентификаторы АЗС как fallback
    }
    const stationNameMap = new Map<string, string>();
    for (const station of stationDetails) {
      stationNameMap.set(station.id, station.user_name);
    }

    // Формирование текста сообщения с использованием for...of
    let text = "";
    for (const [stationId, statusIdMap] of stationMap.entries()) {
      const stationName = `${stationNameMap.get(stationId)} :`;

      text += `start_line<a href="tg://resolve?domain=Test_93848493939_bot&start=${stationId}-">${stationName}</a>\n`;
      for (const [statusId, count] of statusIdMap.entries()) {
        text += `<a href="tg://resolve?domain=Test_93848493939_bot&start=${stationId}-${statusId}">${cachedStatuses[statusId].description}</a>: ${count} заявок\n`;
      }
      text += "\n";
    }
    if (!text) {
      text = "Заявки не найдены";
    }

    // Разбиваем текст на страницы и отправляем первую страницу
    const BLOCKS_PER_PAGE = 5;
    const pages = paginateInfoText(text, BLOCKS_PER_PAGE);
    const messageText = pages[pageIndex];
    const keyboard = getInfoPaginationKeyboard(pageIndex, pages.length);
    try {
      await ctx.editMessageText(messageText, {
        reply_markup: keyboard,
      });
    } catch {
      await ctx.reply(messageText, {
        reply_markup: keyboard,
      });
    }
  } catch (error) {
    logger.error("Ошибка в infoCommandHandler:", error);
  }
}
