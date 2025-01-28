import { selectConsiderPetrolStationData } from "#root/bot/callback-data/index.js";
import { TicketStatus, UserGroup } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
import { ServicesType } from "#root/container.js";
import { ManagerType } from "#root/types/manager.js";
import { PetrolStationType } from "#root/types/petrol-station.js";
import { InlineKeyboard } from "grammy";

type Properties = {
  services: ServicesType;
  userId: string;
};

const getTicketsManager = async ({ services, userId }: Properties) => {
  const { petrol_stations: petrolStations } = (await services.Manager.getUnique(
    userId,
  )) as ManagerType & {
    petrol_stations: PetrolStationType[];
  };

  if (!petrolStations) {
    throw new Error("Petrol stations not found");
  }

  const tickets = petrolStations.flatMap(
    ({ tickets: petrolStationTickets }) => petrolStationTickets || [],
  );

  return tickets;
};

const getTicketsTaskPerformer = async ({ services, userId }: Properties) => {
  const { tickets } = await services.TaskPerformer.getUnique(userId);

  return tickets;
};

const getTicketsSupervisor = async ({ services }: Properties) => {
  const tickets = await services.Ticket.getAll();

  return tickets;
};

const getTickets = {
  [UserGroup.Manager]: getTicketsManager,
  [UserGroup.TaskPerformer]: getTicketsTaskPerformer,
  [UserGroup.Supervisor]: getTicketsSupervisor,
};

export const createFilteredPetrolStationsKeyboard = async (
  ctx: Context,
  statuses: TicketStatus[],
) => {
  const { services, session } = ctx;
  const {
    user: { id: userId, user_group: userGroup },
  } = session;

  if (!(userGroup in getTickets)) {
    throw new Error("This group is not supported");
  }

  const tickets = await getTickets[userGroup as keyof typeof getTickets]({
    services,
    userId,
  });

  const petrolStations = tickets
    ?.filter((ticket) => statuses.includes(ticket.status_id as TicketStatus))
    .map((ticket) => ticket.petrol_station_id);

  const uniqueStations = [...new Set(petrolStations)];
  const users = await services.User.getSelect(uniqueStations || []);
  if (users.length === 0) {
    throw new Error("Tickets not found");
  }

  return InlineKeyboard.from(
    chunk(
      users.map(({ user_name: userName, id }) => ({
        text: userName,
        callback_data: selectConsiderPetrolStationData.pack({
          id,
          statuses: statuses.join(","),
        }),
      })),
      2,
    ),
  );
};
