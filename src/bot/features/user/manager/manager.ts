import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/index.js";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import { ManagerButtons } from "#root/bot/const/buttons/manager-buttons.js";
import {
  showTicketsHandler,
  viewPetrolStationsHandler,
  deleteTicketHandler,
  editTicketHandler,
} from "#root/bot/handlers/index.js";
import {
  selectPetrolStationData,
  editTicketData,
  deleteTicketData,
} from "#root/bot/callback-data/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.hears(
  ManagerButtons.AllTickets,
  logHandle("hears-all-tickets"),
  chatAction("typing"),
  viewPetrolStationsHandler,
);

feature.callbackQuery(
  selectPetrolStationData.filter(),
  logHandle("select-petrol-station"),
  chatAction("typing"),
  showTicketsHandler,
);

feature.callbackQuery(
  editTicketData.filter(),
  logHandle("callbackQuery-edit-ticket"),
  chatAction("typing"),
  editTicketHandler,
);

feature.callbackQuery(
  deleteTicketData.filter(),
  logHandle("callbackQuery-delete-ticket"),
  chatAction("typing"),
  deleteTicketHandler,
);

export { composer as managerFeature };
