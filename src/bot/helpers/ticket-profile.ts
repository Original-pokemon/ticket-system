import { TicketType } from "#root/services/index.js";
import { UserText } from "../const/index.js";
import { Context } from "../context.js";

export const getTicketText = async (ctx: Context, ticket: TicketType) => {
  const {
    petrol_station_id: petrolStationId,
    ticket_category: ticketCategoryId,
    status_id: statusId,
    description: ticketDescription,
  } = ticket;

  const { TICKET_TITLE, NUMBER, CATEGORY, STATUS, DESCRIPTION } =
    UserText.TicketProfile;

  const { user_name: userName } = await ctx.services.User.getUnique(
    petrolStationId.toString(),
  );

  const { description: categoryDescription } = ticketCategoryId
    ? await ctx.services.Category.getUnique(ticketCategoryId.toString())
    : { description: "Не определена" };

  const { description: statusDescription } =
    await ctx.services.Status.getUnique(statusId.toString());

  return `
    ${TICKET_TITLE}
    ${NUMBER}: ${userName}
    ${CATEGORY}: ${categoryDescription}
    ${STATUS}: ${statusDescription}
    ${DESCRIPTION}: ${ticketDescription}
  `;
};
