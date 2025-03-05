import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { Composer } from "grammy";

import {
  selectTicketData,
  transferTicketData,
  selectTicketsData,
  SelectTicketScene,
  startMessageCallback,
} from "#root/bot/callback-data/index.js";
import {
  showTicketHandler,
  showTicketsFilteredHandler,
  viewPetrolStationsFilteredHandler,
  transferTicketHandler,
  createTicketHandler,
  viewStatusSectionHandler,
  welcomeCallbackHandler,
} from "#root/bot/handlers/index.js";
import {
  ManagerButtons,
  PetrolStationButtons,
  SupervisorButtons,
  TaskPerformerButtons,
} from "#root/bot/const/index.js";
import { isAuthUser } from "#root/bot/filters/is-user.js";
import { isAdmin } from "#root/bot/filters/is-bot-admin.js";

import { managerFeature } from "./manager/manager.js";
import { taskPerformerFeature } from "./task-performer/task-performer.js";
import { petrolStationFeature } from "./petrol-station/petrol-station.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private").filter(({ session }) => {
  return (
    isAuthUser(session.user.user_group) || isAdmin(session.user.user_group)
  );
});

feature.callbackQuery(startMessageCallback.filter(), welcomeCallbackHandler);

feature.use(managerFeature);
feature.use(taskPerformerFeature);
feature.use(petrolStationFeature);

feature.callbackQuery(
  selectTicketData.filter(),
  logHandle("callbackQuery-show-ticket"),
  showTicketHandler,
);

feature.callbackQuery(
  transferTicketData.filter(),
  logHandle("callbackQuery-send-ticket"),
  transferTicketHandler,
);

feature.hears(
  [
    ManagerButtons.ConsiderTickets,
    ManagerButtons.AllTickets,
    TaskPerformerButtons.ConsiderTickets,
    TaskPerformerButtons.TicketsForPerformance,
    SupervisorButtons.AllTickets,
  ],
  logHandle("hears-consider-tickets"),
  viewStatusSectionHandler,
);

feature.callbackQuery(
  selectTicketsData.filter({
    scene: SelectTicketScene.Status,
  }),
  logHandle("callback-show-all-tickets"),
  viewStatusSectionHandler,
);

feature.hears(
  [ManagerButtons.CreateTicket, PetrolStationButtons.CreateTicket],
  logHandle("hears-create-ticket"),
  createTicketHandler,
);

feature.callbackQuery(
  selectTicketsData.filter({
    scene: SelectTicketScene.PetrolStation,
  }),
  logHandle("select-filtered-petrol-station"),
  viewPetrolStationsFilteredHandler,
);

feature.callbackQuery(
  selectTicketsData.filter({
    scene: SelectTicketScene.Ticket,
  }),
  logHandle("select-filtered-tickets-station"),
  showTicketsFilteredHandler,
);

export { composer as userFeature };
