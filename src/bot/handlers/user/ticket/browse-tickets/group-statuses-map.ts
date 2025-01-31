import {
  ManagerButtons,
  TaskPerformerButtons,
  PetrolStationButtons,
  SupervisorButtons,
  TicketStatus,
  UserGroup,
} from "#root/bot/const/index.js";

const ALL_STATUSES = Object.values(TicketStatus);

const unsupportedButton = () => {
  throw new Error("unsupported button");
};

export const groupStatusesMap = {
  [UserGroup.Manager]: {
    [ManagerButtons.ConsiderTickets]: [
      TicketStatus.ReviewedManager,
      TicketStatus.WaitingConfirmation,
    ],
    [ManagerButtons.AllTickets]: ALL_STATUSES,
    [TaskPerformerButtons.ConsiderTickets]: unsupportedButton,
    [TaskPerformerButtons.TicketsForPerformance]: unsupportedButton,
    [PetrolStationButtons.AllTickets]: unsupportedButton,
  },
  [UserGroup.TaskPerformer]: {
    [TaskPerformerButtons.ConsiderTickets]: [
      TicketStatus.SeenTaskPerformer,
      TicketStatus.ReviewedTaskPerformer,
    ],
    [TaskPerformerButtons.TicketsForPerformance]: [TicketStatus.Performed],
    [ManagerButtons.ConsiderTickets]: unsupportedButton,
    [ManagerButtons.AllTickets]: unsupportedButton,
    [PetrolStationButtons.AllTickets]: unsupportedButton,
  },
  [UserGroup.Supervisor]: {
    [SupervisorButtons.AllTickets]: ALL_STATUSES,
    [ManagerButtons.ConsiderTickets]: unsupportedButton,
    [TaskPerformerButtons.ConsiderTickets]: unsupportedButton,
    [TaskPerformerButtons.TicketsForPerformance]: unsupportedButton,
    [PetrolStationButtons.AllTickets]: unsupportedButton,
  },
  [UserGroup.Admin]: {
    [SupervisorButtons.AllTickets]: ALL_STATUSES,
    [ManagerButtons.ConsiderTickets]: unsupportedButton,
    [TaskPerformerButtons.ConsiderTickets]: unsupportedButton,
    [TaskPerformerButtons.TicketsForPerformance]: unsupportedButton,
    [PetrolStationButtons.AllTickets]: unsupportedButton,
  },
};
