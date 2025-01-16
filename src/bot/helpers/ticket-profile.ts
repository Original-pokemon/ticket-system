import { TicketType } from "#root/services/index.js";
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

  const managers = statusHistory?.filter(
    (history) => history.ticket_status === TicketStatus.ReviewedTaskPerformer,
  );

  const managerId =
    managers && managers.length > 0 ? managers[0].user_id : undefined;

  const userPromise = ctx.services.User.getUnique(petrolStationId);
  const categoryPromise = ticketCategoryId
    ? ctx.services.Category.getUnique(ticketCategoryId.toString())
    : Promise.resolve({ description: "Не определена" });
  const statusPromise = ctx.services.Status.getUnique(statusId.toString());
  const managerPromise = managerId
    ? ctx.services.User.getUnique(managerId).then(
        (user) => user?.login || "Неизвестно",
      )
    : Promise.resolve("Неизвестно");

  const [user, category, statusObject, managerLogin] = await Promise.all([
    userPromise,
    categoryPromise,
    statusPromise,
    managerPromise,
  ]);

  const userName = user?.user_name ?? "Неизвестно";
  const categoryDescription = category?.description ?? "Не определена";
  const statusDescription = statusObject?.description ?? "Неизвестен";

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
