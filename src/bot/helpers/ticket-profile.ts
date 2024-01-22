import { TicketType } from "#root/services/index.js";
import { UserText } from "../const/index.js";
import { Context } from "../context.js";

export const getTicketText = async (ctx: Context, ticket: TicketType) => {
  const {
    petrol_station_id: petrolStationId,
    title,
    ticket_category: ticketCategoryId,
    ticket_priority: ticketPriorityId,
    status_id: statusId,
  } = ticket;

  const { TICKET_TITLE, TITLE, NUMBER, CATEGORY, PRIORITY, STATUS } =
    UserText.TicketProfile;

  const { description: categoryDescription } = ticketCategoryId
    ? await ctx.services.Category.getUnique(ticketCategoryId.toString())
    : { description: "Не определена" };

  const { description: priorityDescription } = ticketPriorityId
    ? await ctx.services.Priority.getUnique(ticketPriorityId.toString())
    : { description: "Не определена" };

  const { description: statusDescription } =
    await ctx.services.Status.getUnique(statusId.toString());

  return `
    ${TICKET_TITLE}
    ${NUMBER}: ${petrolStationId}
    ${TITLE}: ${title}
    ${CATEGORY}: ${categoryDescription}
    ${PRIORITY}: ${priorityDescription}
    ${STATUS}: ${statusDescription}
  `;
};
