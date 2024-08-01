import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import {
  selectTicketData,
  selectConsiderPetrolStationData,
  transferTicketData,
  showPetrolStationsData,
} from "#root/bot/callback-data/index.js";
import {
  showTicketHandler,
  showTicketsFilteredHandler,
  viewPetrolStationsFilteredHandler,
  transferTicketHandler,
  createTicketHandler,
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
  transferTicketData.filter(),
  logHandle("callbackQuery-send-ticket"),
  chatAction("typing"),
  transferTicketHandler,
);

feature.hears(
  [
    ManagerButtons.ConsiderTickets,
    TaskPerformerButtons.ConsiderTickets,
    ManagerButtons.AllTickets,
    SupervisorButtons.AllTickets,
  ],
  logHandle("hears-consider-tickets"),
  chatAction("typing"),
  viewPetrolStationsFilteredHandler,
);

feature.callbackQuery(
  showPetrolStationsData.filter(),
  logHandle("callbackQuery-show-petrol-stations"),
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

export { composer as userFeature };
