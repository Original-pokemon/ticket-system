import { UserGroup } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { ServicesType } from "#root/container.js";
import { groupStatusesMap } from "./group-statuses-map.js";

type LoadTicketsParameters = {
  ctx: Context;
  services: ServicesType;
  userId: string;
};

const loadManagerTickets = async ({ ctx }: LoadTicketsParameters) => {
  const { data: petrolStationsCached } = ctx.session.petrolStations;
  if (!petrolStationsCached) {
    throw new Error("Petrol stations not found");
  }
  return Object.values(petrolStationsCached).flatMap((ps) => ps.tickets || []);
};

const getTicketsTaskPerformer = async ({
  services,
  userId,
}: LoadTicketsParameters) => {
  const { tickets } = await services.TaskPerformer.getUnique(userId);
  return tickets;
};

const getTicketsSupervisor = async ({ services }: LoadTicketsParameters) => {
  return services.Ticket.getAll();
};

const loadTicketsMap = {
  [UserGroup.Manager]: loadManagerTickets,
  [UserGroup.TaskPerformer]: getTicketsTaskPerformer,
  [UserGroup.Supervisor]: getTicketsSupervisor,
  [UserGroup.Admin]: getTicketsSupervisor,
};

export async function getAllTicketsForUserGroup(
  userGroup: UserGroup,
  parameters: LoadTicketsParameters,
) {
  if (!(userGroup in loadTicketsMap)) {
    throw new Error(`User group ${userGroup} not handled for ticket loading.`);
  }
  const function__ = loadTicketsMap[userGroup as keyof typeof groupStatusesMap];
  const tickets = await function__(parameters);
  if (!tickets) {
    throw new Error("No tickets found for this userGroup.");
  }
  return tickets;
}
