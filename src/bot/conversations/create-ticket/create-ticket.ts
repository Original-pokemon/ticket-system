import { Context } from "#root/bot/context.js";
import { createConversation } from "@grammyjs/conversations";
import { Container } from "#root/container.js";
import { getPhotos, viewTicketProfile } from "#root/bot/handlers/index.js";
import { TicketType } from "#root/services/index.js";
import {
  ticketProfilePanelManager,
  ticketProfilePanelPetrolSTation,
} from "#root/bot/keyboards/index.js";
import { UserText, TicketStatus } from "#root/bot/const/index.js";
import { isManager } from "#root/bot/filters/index.js";
import { getPetrolStation, getCategory } from "./index.js";

export const CREATE_TICKET_CONVERSATION = "create-ticket";
export const createTicketConversation = (container: Container) =>
  createConversation<Context>(async (conversation, ctx) => {
    const { services } = container;
    const {
      session: {
        user: { user_group: userGroup, id: userId },
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
      : [userId, ctx];

    await (isManagerUser
      ? petrolStationCtx.editMessageText(UserText.CreateTicket.TICKET_TITLE)
      : petrolStationCtx.reply(UserText.CreateTicket.TICKET_TITLE));

    const ticketTitle = await form.text();

    await ctx.reply(UserText.CreateTicket.TICKET_DESCRIPTION);
    const description = await form.text();

    const [category, categoryCtx] = await (isManagerUser
      ? getCategory(conversationProperties)
      : [undefined, ctx]);

    if (isManagerUser) {
      await categoryCtx.deleteMessage();
    }

    const [photoUrs, photosCtx] = await getPhotos({
      ...conversationProperties,
    });

    const newTicket: TicketType = {
      user_id: userId,
      petrol_station_id: petrolStationNumber,
      title: ticketTitle,
      description,
      attachments: photoUrs,
      ticket_category: category,
      status_id: isManagerUser
        ? TicketStatus.ReviewedManager
        : TicketStatus.Created,
      comments: [],
    };

    const createdTicketId = await services.Ticket.create(newTicket);
    await photosCtx.editMessageText(UserText.CreateTicket.SAVE_TICKET);

    if (!createdTicketId) {
      throw new Error("ticket id not provided");
    }

    const keyboard = isManagerUser
      ? ticketProfilePanelManager(createdTicketId)
      : ticketProfilePanelPetrolSTation(createdTicketId);

    await viewTicketProfile({
      ctx: photosCtx,
      ticketId: createdTicketId,
      inlineKeyboard: keyboard,
    });
  }, CREATE_TICKET_CONVERSATION);
