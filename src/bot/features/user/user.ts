import type { Context } from "#root/bot/context.ts";
import { logHandle } from "#root/bot/helpers/logging.ts";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import {
  selectTicketData,
  selectConsiderPetrolStationData,
  selectConsiderTicketData,
  sendTicketData,
} from "#root/bot/callback-data/index.ts";
import {
  showTicketHandler,
  showFilteredTicketHandler,
  showTicketsFilteredHandler,
  viewPetrolStationsFilteredHandler,
  sendTicketHandler,
} from "#root/bot/handlers/index.ts";

import { ManagerButtons, TaskPerformerButtons } from "#root/bot/const/index.ts";
import { managerFeature } from "./manager/manager.ts";
import { taskPerformerFeature } from "./task-performer/task-performer.ts";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.use(managerFeature);
feature.use(taskPerformerFeature);

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
