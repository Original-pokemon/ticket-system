import { Context } from "#root/bot/context.ts";
import { createConversation } from "@grammyjs/conversations";
import { Container } from "#root/container.ts";
import { getPhotos, viewTicketProfile } from "#root/bot/handlers/index.ts";
import { TicketType } from "#root/services/index.ts";
import { ticketProfilePanelManager } from "#root/bot/keyboards/index.ts";
import { UserText, TicketStatus } from "#root/bot/const/index.ts";
import { isManager } from "#root/bot/filters/index.ts";
import { getPetrolStation, getCategory, getPriority } from "./index.ts";

export const CREATE_TICKET_CONVERSATION = "create-ticket";
export const createTicketConversation = (container: Container) =>
  createConversation<Context>(async (conversation, ctx) => {
    const { services } = container;
    const {
      session: {
        user: { user_group: userGroup, user_name: userName, id },
      },
      form,
    } = conversation;

    ctx.services = services;

    const conversationProperties = {
      ctx,
      conversation,
    };

    const isManagerUser = isManager(userGroup);

    const [petrolStationNumber, petrolStationCtx] = isManagerUser
      ? await getPetrolStation(conversationProperties)
      : [userName, ctx];

    await (isManagerUser
      ? petrolStationCtx.editMessageText(UserText.CreateTicket.TICKET_TITLE)
      : petrolStationCtx.reply(UserText.CreateTicket.TICKET_TITLE));

    const ticketTitle = await form.text();

    await ctx.reply(UserText.CreateTicket.TICKET_DESCRIPTION);
    const description = await form.text();

    const [category, categoryCtx] = await (isManagerUser
      ? getCategory(conversationProperties)
      : [undefined, ctx]);

    const [priority, priorityCtx] = await (isManagerUser
      ? getPriority({ ...conversationProperties, ctx: categoryCtx })
      : [undefined, ctx]);

    await priorityCtx.deleteMessage();

    const [photoUrs, photosCtx] = await getPhotos({
      ...conversationProperties,
    });

    const newTicket: TicketType = {
      user_id: id,
      petrol_station_id: petrolStationNumber,
      title: ticketTitle,
      description,
      attachments: photoUrs,
      ticket_category: category,
      ticket_priority: priority,
      status_id: isManagerUser
        ? TicketStatus.ReviewedManager
        : TicketStatus.Created,
      comments: [],
    };

    const createdTicketId = await services.Ticket.create(newTicket);
    await photosCtx.editMessageText(UserText.CreateTicket.SAVE_TICKET);

    const ticket = await services.Ticket.getUnique(createdTicketId);

    if (!ticket?.id) {
      throw new Error("ticket id not provided");
    }

    await viewTicketProfile({
      ctx: photosCtx,
      ticket,
      inlineKeyboard: ticketProfilePanelManager(ticket.id),
    });
  }, CREATE_TICKET_CONVERSATION);
