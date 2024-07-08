import { selectConsiderPetrolStationData } from "#root/bot/callback-data/index.js";
import { TicketStatus, UserGroup } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { isManager, isTaskPerformer } from "#root/bot/filters/index.js";
import { chunk } from "#root/bot/helpers/index.js";
import { ServicesType } from "#root/container.js";
import { InlineKeyboard } from "grammy";

type Properties = {
  services: ServicesType;
  userId: string;
};

const getTicketsManager = async ({ services, userId }: Properties) => {
  const { tickets: ticketsPerPetrolStation } =
    await services.Manager.getUnique(userId);
  const ticketsId = ticketsPerPetrolStation
    ?.map((ticket) => {
      return ticket.tickets;
    })
    .flat();

  const tickets = await services.Ticket.getSelect(ticketsId || []);

  return tickets;
};

const getTicketsTaskPerformer = async ({ services, userId }: Properties) => {
  const { tickets: ticketsId } = await services.TaskPerformer.getUnique(userId);

  const tickets = await services.Ticket.getSelect(ticketsId || []);

  return tickets;
};

const getTickets = {
  [UserGroup.Manager]: getTicketsManager,
  [UserGroup.TaskPerformer]: getTicketsTaskPerformer,
};

export const createFilteredPetrolStationsKeyboard = async (
  ctx: Context,
  status: TicketStatus,
) => {
  const { services, session } = ctx;
  const {
    user: { id: userId, user_group: userGroup },
  } = session;

  if (!isManager(userGroup) && !isTaskPerformer(userGroup)) {
    throw new Error("This group is not supported");
  }

  const tickets = await getTickets[userGroup]({
    services,
    userId,
  });

  const petrolStations = tickets
    .filter((ticket) => ticket.status_id === status)
    .map((ticket) => ticket.petrol_station_id);

  const users = await services.User.getSelect(petrolStations || []);

  return InlineKeyboard.from(
    chunk(
      users.map(({ user_name: userName, id }) => ({
        text: userName,
        callback_data: selectConsiderPetrolStationData.pack({
          id,
          status,
        }),
      })),
      2,
    ),
  );
};
