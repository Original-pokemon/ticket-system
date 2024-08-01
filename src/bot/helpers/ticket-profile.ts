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

  const { user_name: userName } =
    await ctx.services.User.getUnique(petrolStationId);

  const managers = statusHistory?.filter(
    (history) => history.ticket_status === TicketStatus.ReviewedTaskPerformer,
  );

  let managerContacts = "Неизвестно";

  if (managers && managers.length > 0) {
    const managerId = managers[0].user_id;
    const { login: managerLogin } =
      await ctx.services.User.getUnique(managerId);

    managerContacts = managerLogin || "Неизвестно";
  }

  const { description: categoryDescription } = ticketCategoryId
    ? await ctx.services.Category.getUnique(ticketCategoryId.toString())
    : { description: "Не определена" };

  const { description: statusDescription } =
    await ctx.services.Status.getUnique(statusId.toString());

  return `
    ${TICKET_TITLE}
    ${NUMBER}: ${userName}
    ${CATEGORY}: ${categoryDescription}
    ${DEADLINE}: ${deadline ? formatDateString(deadline) : "Не определена"}
    ${MANAGER}: @${managerContacts}
    ${STATUS}: ${statusDescription}
    ${DESCRIPTION}: ${ticketDescription}
  `;
};
