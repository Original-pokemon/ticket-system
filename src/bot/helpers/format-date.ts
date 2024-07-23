import dayjs from "dayjs";
import "dayjs/locale/ru";

/**
 * Форматирует дату из строки ISO 8601 в более читабельный формат "DD MMM YYYY".
 * @param {string} dateStr - Строка даты в формате ISO 8601.
 * @returns {string} Отформатированная строка даты.
 */
function formatDateString(dateString: string): string {
  const date = dayjs(dateString);
  return date.locale("ru").format("DD MMM YYYY");
}

export default formatDateString;
