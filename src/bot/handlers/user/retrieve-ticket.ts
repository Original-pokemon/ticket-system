import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";
import { TicketStatus, UserGroup, UserText } from "#root/bot/const/index.js";
import { TicketType } from "#root/services/index.js";
import { retrieveTicketData } from "#root/bot/callback-data/index.js";
import { sendManagers, sendTaskPerformers } from "#root/bot/helpers/index.js";
import { createTicketNotificationKeyboard } from "#root/bot/keyboards/index.js";

type Properties = {
  ctx: Context;
  ticket: TicketType;
};

const sendManagersNotificationAboutRetrieveTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  if (!ticket.id) {
    throw new Error("Ticket Id not found");
  }

  if (ticket.status_id === TicketStatus.SeenTaskPerformer) {
    const statusId = TicketStatus.ReviewedManager;

    const updatedTicket = await ctx.services.Ticket.update({
      ...ticket,
      // eslint-disable-next-line unicorn/no-null
      ticket_category: null,
      status_id: statusId,
      status_history: [
        {
          user_id: ctx.session.user.id,
          ticket_status: statusId,
        },
      ],
    });

    const markup = createTicketNotificationKeyboard({
      ticketId: ticket.id,
      status: statusId,
    });

    await sendManagers(
      {
        ctx,
        ticket: updatedTicket,
      },
      UserText.RETRIEVE_TICKET(ticket.title),
      markup,
    );
  } else {
    await ctx.editMessageText(UserText.Notification.ERROR_USER_GROUP);

    throw new Error("Ticket status is not correct");
  }
};

const sendTaskPerformerNotificationAboutRetrieveTicket = async ({
  ctx,
  ticket,
}: Properties) => {
  if (!ticket.id) {
    throw new Error("Ticket Id not found");
  }
  if (ticket.status_id === TicketStatus.WaitingConfirmation) {
    const statusId = TicketStatus.ReviewedTaskPerformer;

    const updatedTicket = await ctx.services.Ticket.updateTicketStatus({
      statusId,
      ticketId: ticket.id,
      userId: ctx.session.user.id,
    });

    const markup = createTicketNotificationKeyboard({
      ticketId: ticket.id,
      status: statusId,
    });

    sendTaskPerformers(
      { ctx, ticket: updatedTicket },
      UserText.RETRIEVE_TICKET(ticket.title),
      markup,
    );
  } else {
    await ctx.editMessageText(UserText.Notification.ERROR_USER_GROUP);

    throw new Error("Ticket status is not correct");
  }
};

const Action = {
  [UserGroup.TaskPerformer]: sendManagersNotificationAboutRetrieveTicket,
  [UserGroup.Manager]: sendTaskPerformerNotificationAboutRetrieveTicket,
};

export const retrieveTicketHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const {
    services,
    callbackQuery: { data },
    session: {
      user: { user_group: userGroup },
    },
  } = ctx;
  const { id } = retrieveTicketData.unpack(data);
  const ticket = await services.Ticket.getUnique(id);

  if (
    userGroup !== UserGroup.TaskPerformer &&
    userGroup !== UserGroup.Manager
  ) {
    throw new Error("User group not supported");
  }
  await Action[userGroup]({ ctx, ticket });

  await ctx.editMessageText(UserText.RETRIEVE_TICKET(ticket.title));
};
