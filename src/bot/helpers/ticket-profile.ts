import { TicketType } from "#root/types/index.js";
import { TicketStatus, UserText } from "../const/index.js";
import { Context } from "../context.js";
import formatDateString from "./format-date.js";

export const getTicketText = async (ctx: Context, ticket: TicketType) => {
  const {
    petrol_station_id: petrolStationId,
    ticket_category: ticketCategoryId,
    status_id: statusId,
    deadline,
    description: ticketDescription,
    status_history: statusHistory,
    title,
  } = ticket;

  const {
    TICKET_TITLE,
    NUMBER,
    CATEGORY,
    DEADLINE,
    STATUS,
    DESCRIPTION,
    MANAGER,
  } = UserText.TicketProfile;

  const {
    session: { categories, statuses },
    services,
  } = ctx;

  const managers = statusHistory?.filter(
    (history) => history.ticket_status === TicketStatus.ReviewedTaskPerformer,
  );

  const managerId =
    managers && managers.length > 0 ? managers[0].user_id : undefined;

  const userPromise = services.User.getUnique(petrolStationId);

  const category =
    ticketCategoryId && categories.data
      ? categories.data[ticketCategoryId]
      : undefined;

  const status = statuses.data ? statuses.data[statusId] : undefined;

  const managerPromise = managerId
    ? services.User.getUnique(managerId).then(
        (user) => user?.login || "Неизвестно",
      )
    : Promise.resolve("Неизвестно");

  const [user, managerLogin] = await Promise.all([userPromise, managerPromise]);

  const userName = user?.user_name ?? "Неизвестно";
  const categoryDescription = category?.description ?? "Не определена";
  const statusDescription = status?.description ?? "Неизвестен";

  return `
    ${TICKET_TITLE}: ${title}
    ${NUMBER}: ${userName}
    ${CATEGORY}: ${categoryDescription}
    ${DEADLINE}: ${deadline ? formatDateString(deadline) : "Не определена"}
    ${MANAGER}: @${managerLogin}
    ${STATUS}: ${statusDescription}
    ${DESCRIPTION}: ${ticketDescription}
  `;
};
