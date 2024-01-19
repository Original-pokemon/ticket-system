import type { Context } from "#root/bot/context.ts";
import { logHandle } from "#root/bot/helpers/index.ts";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import { ManagerButtons } from "#root/bot/const/buttons/manager-buttons.ts";
import {
  showTicketsHandler,
  viewPetrolStationsHandler,
  deleteTicketHandler,
  editTicketHandler,
} from "#root/bot/handlers/index.ts";
import {
  selectPetrolStationData,
  editTicketData,
  deleteTicketData,
} from "#root/bot/callback-data/index.ts";

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
