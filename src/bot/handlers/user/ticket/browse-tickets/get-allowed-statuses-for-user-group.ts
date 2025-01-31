import {
  ManagerButtons,
  SupervisorButtons,
  TaskPerformerButtons,
  TicketStatus,
  UserGroup,
} from "#root/bot/const/index.js";
import { groupStatusesMap } from "./group-statuses-map.js";

export type HearsTextType =
  | ManagerButtons.ConsiderTickets
  | TaskPerformerButtons.ConsiderTickets
  | TaskPerformerButtons.TicketsForPerformance
  | SupervisorButtons.AllTickets;

export function getAllowedStatusesForUserGroup(
  userGroup: UserGroup,
  buttonText: HearsTextType,
): TicketStatus[] {
  if (!(userGroup in groupStatusesMap)) {
    throw new Error(`User group ${userGroup} not found in groupStatusesMap.`);
  }

  const groupMap = groupStatusesMap[userGroup as keyof typeof groupStatusesMap];
  const result = groupMap[buttonText];

  if (typeof result === "function") {
    result();
    return [];
  }

  return result;
}
