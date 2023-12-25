import type { Context } from "#root/bot/context.ts";
import { logHandle } from "#root/bot/helpers/index.ts";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import { ManagerButtons } from "#root/bot/const/buttons/manager-buttons.ts";
import { createTicketHandler } from "#root/bot/handlers/index.ts";
import { selectPetrolStationData } from "#root/bot/callback-data/index.ts";
import { showTicketsHandler } from "#root/bot/handlers/user/manager/view-all-tickets/view-tickets.ts";
import { viewPetrolStationsHandler } from "#root/bot/handlers/user/manager/view-all-tickets/view-petrol-stations.ts";
import { viewPetrolStationsFilteredHandler } from "#root/bot/handlers/user/manager/consider-tickets/view-petrol-stations.ts";
import { editTicketHandler } from "#root/bot/handlers/user/manager/edit-ticket.ts";
import { editTicketData } from "#root/bot/callback-data/user/ticket/edit-ticket.user.ts";
import { selectConsiderTicketData } from "#root/bot/callback-data/user/manager/select-consider-ticket.manager.ts";
import { showConsiderTicketHandler } from "#root/bot/handlers/user/manager/consider-tickets/select-ticket.ts";
import { selectConsiderPetrolStationData } from "#root/bot/callback-data/user/manager/select-consider-petrol-station.manager.ts";
import { showTicketsFilteredPerTicketStatusHandler } from "#root/bot/handlers/user/manager/consider-tickets/view-tickets.ts";
import { deleteTicketData } from "#root/bot/callback-data/user/ticket/delete-ticket.user.ts";
import { deleteTicketHandler } from "#root/bot/handlers/user/manager/delete-ticket.ts";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.hears(
  ManagerButtons.CreateTicket,
  logHandle("hears-create-ticket"),
  chatAction("typing"),
  createTicketHandler,
);

feature.hears(
  ManagerButtons.AllTickets,
  logHandle("hears-all-tickets"),
  chatAction("typing"),
  viewPetrolStationsHandler,
);

feature.hears(
  ManagerButtons.ConsiderTickets,
  logHandle("hears-consider-tickets"),
  chatAction("typing"),
  viewPetrolStationsFilteredHandler,
);

feature.callbackQuery(
  selectPetrolStationData.filter(),
  logHandle("select-petrol-station"),
  chatAction("typing"),
  showTicketsHandler,
);

feature.callbackQuery(
  selectConsiderPetrolStationData.filter(),
  logHandle("select-petrol-station"),
  chatAction("typing"),
  showTicketsFilteredPerTicketStatusHandler,
);

feature.callbackQuery(
  editTicketData.filter(),
  logHandle("callbackQuery-edit-ticket"),
  chatAction("typing"),
  editTicketHandler,
);

feature.callbackQuery(
  selectConsiderTicketData.filter(),
  logHandle("callbackQuery-view-ticket"),
  chatAction("typing"),
  showConsiderTicketHandler,
);

feature.callbackQuery(
  deleteTicketData.filter(),
  logHandle("callbackQuery-delete-ticket"),
  chatAction("typing"),
  deleteTicketHandler,
);

export { composer as managerFeature };
