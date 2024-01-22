import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/index.js";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import { showTicketsForPetrolStationHandler } from "#root/bot/handlers/index.js";
import { PetrolStationButtons } from "#root/bot/const/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.hears(
  PetrolStationButtons.AllTickets,
  logHandle("hears-all-tickets-for-petrol-station"),
  chatAction("typing"),
  showTicketsForPetrolStationHandler,
);

export { composer as petrolStationFeature };
