import { Context } from "#root/bot/context.js";
import { Conversation, createConversation } from "@grammyjs/conversations";
import { Container } from "#root/container.js";
import { getPhotos, viewTicketProfile } from "#root/bot/handlers/index.js";
import { TicketType } from "#root/services/index.js";
import {
  ticketProfilePanelManager,
  ticketProfilePanelPetrolSTation,
} from "#root/bot/keyboards/index.js";
import { UserText, TicketStatus, UserGroup } from "#root/bot/const/index.js";
import { isAuthUser } from "#root/bot/filters/is-user.js";
import { getPetrolStation, getCategory } from "./index.js";

type ConversationProperties = {
  ctx: Context;
  conversation: Conversation<Context>;
};

type SupportedUserGroup =
  | UserGroup.Manager
  | UserGroup.Supervisor
  | UserGroup.PetrolStation;

export const CREATE_TICKET_CONVERSATION = "create-ticket";

const getUserActions = (conversationProperties: ConversationProperties) => ({
  [UserGroup.Manager]: {
    getPetrolStation: () => getPetrolStation(conversationProperties),
    getCategory: () => getCategory(conversationProperties),
    getStatus: () => TicketStatus.ReviewedManager,
    getKeyboard: (ticketId: string) => ticketProfilePanelManager(ticketId),
    editMessage: (ctx: Context, message: string) =>
      ctx.editMessageText(message),
  },
  [UserGroup.Supervisor]: {
    getPetrolStation: () => getPetrolStation(conversationProperties),
    getCategory: (): [undefined, Context] => [
      undefined,
      conversationProperties.ctx,
    ],
    getStatus: () => TicketStatus.Created,
    getKeyboard: (ticketId: string) =>
      ticketProfilePanelPetrolSTation(ticketId),
    editMessage: (ctx: Context, message: string) =>
      ctx.editMessageText(message),
  },
  [UserGroup.PetrolStation]: {
    getPetrolStation: (): [string, Context] => [
      conversationProperties.ctx.session.user.id,
      conversationProperties.ctx,
    ],
    getCategory: (): [undefined, Context] => [
      undefined,
      conversationProperties.ctx,
    ],
    getStatus: () => TicketStatus.Created,
    getKeyboard: (ticketId: string) =>
      ticketProfilePanelPetrolSTation(ticketId),
    editMessage: (ctx: Context, message: string) => ctx.reply(message),
  },
});

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

    const conversationProperties: ConversationProperties = {
      ctx,
      conversation,
    };

    if (!isAuthUser(userGroup)) {
      throw new Error("Unsupported user group");
    }

    const userActions = getUserActions(conversationProperties)[
      userGroup as SupportedUserGroup
    ];

    const [petrolStationNumber, petrolStationCtx] =
      await userActions.getPetrolStation();

    await userActions.editMessage(
      petrolStationCtx,
      UserText.CreateTicket.TICKET_TITLE,
    );

    const ticketTitle = await form.text();

    await ctx.reply(UserText.CreateTicket.TICKET_DESCRIPTION);
    const description = await form.text();

    const [category, categoryCtx] = await userActions.getCategory();

    if (categoryCtx && categoryCtx.deleteMessage) {
      await categoryCtx.deleteMessage();
    }

    const [photoUrs, photosCtx] = await getPhotos(conversationProperties);

    const newTicket: TicketType = {
      user_id: userId,
      petrol_station_id: petrolStationNumber,
      title: ticketTitle,
      description,
      attachments: photoUrs,
      ticket_category: category,
      status_id: userActions.getStatus(),
      comments: [],
    };

    const createdTicketId = await services.Ticket.create(newTicket);
    await photosCtx.editMessageText(UserText.CreateTicket.SAVE_TICKET);

    if (!createdTicketId) {
      throw new Error("ticket id not provided");
    }

    const keyboard = userActions.getKeyboard(createdTicketId);

    await viewTicketProfile({
      ctx: photosCtx,
      ticketId: createdTicketId,
      inlineKeyboard: keyboard,
    });
  }, CREATE_TICKET_CONVERSATION);
