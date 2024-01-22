import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import {
  selectTicketData,
  selectConsiderPetrolStationData,
  selectConsiderTicketData,
  sendTicketData,
} from "#root/bot/callback-data/index.js";
import {
  showTicketHandler,
  showFilteredTicketHandler,
  showTicketsFilteredHandler,
  viewPetrolStationsFilteredHandler,
  sendTicketHandler,
  createTicketHandler,
} from "#root/bot/handlers/index.js";

import {
  ManagerButtons,
  PetrolStationButtons,
  TaskPerformerButtons,
} from "#root/bot/const/index.js";
import { managerFeature } from "./manager/manager.js";
import { taskPerformerFeature } from "./task-performer/task-performer.js";
import { petrolStationFeature } from "./petrol-station/petrol-station.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.use(managerFeature);
feature.use(taskPerformerFeature);
feature.use(petrolStationFeature);

feature.callbackQuery(
  selectTicketData.filter(),
  logHandle("callbackQuery-show-ticket"),
  chatAction("typing"),
  showTicketHandler,
);

feature.callbackQuery(
  sendTicketData.filter(),
  logHandle("callbackQuery-send-ticket"),
  chatAction("typing"),
  sendTicketHandler,
);

feature.hears(
  [ManagerButtons.ConsiderTickets, TaskPerformerButtons.ConsiderTickets],
  logHandle("hears-consider-tickets"),
  chatAction("typing"),
  viewPetrolStationsFilteredHandler,
);

feature.hears(
  [ManagerButtons.CreateTicket, PetrolStationButtons.CreateTicket],
  logHandle("hears-create-ticket"),
  chatAction("typing"),
  createTicketHandler,
);

feature.callbackQuery(
  selectConsiderPetrolStationData.filter(),
  logHandle("select-filtered-petrol-station"),
  chatAction("typing"),
  showTicketsFilteredHandler,
);

feature.callbackQuery(
  selectConsiderTicketData.filter(),
  logHandle("callbackQuery-view-ticket"),
  chatAction("typing"),
  showFilteredTicketHandler,
);

export { composer as userFeature };
