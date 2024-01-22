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

const getTicketIdsManager = async ({ services, userId }: Properties) => {
  const { tickets } = await services.Manager.getUnique(userId);
  const ticketsId = tickets
    ?.map((ticket) => {
      return ticket.tickets;
    })
    .flat();

  return ticketsId;
};

const getTicketIdsTaskPerformer = async ({ services, userId }: Properties) => {
  const { ticket: ticketsId } = await services.TaskPerformer.getUnique(userId);

  return ticketsId;
};

const getTicketIdsPetrolStation = async ({ services, userId }: Properties) => {
  const { tickets: ticketsId } = await services.PetrolStation.getUnique(userId);

  return ticketsId;
};

const getTicketIds = {
  [UserGroup.Manager]: getTicketIdsManager,
  [UserGroup.TaskPerformer]: getTicketIdsTaskPerformer,
  [UserGroup.PetrolStation]: getTicketIdsPetrolStation,
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

  const ticketIds = await getTicketIds[userGroup]({
    services,
    userId,
  });

  const ticketsInfo = await services.Ticket.getSelect(ticketIds || []);

  const petrolStations = ticketsInfo
    .filter((ticket) => ticket.status_id === status)
    .map((ticket) => ticket.petrol_station_id);

  const users = petrolStations?.length
    ? await services.User.getSelect(petrolStations)
    : [];

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
