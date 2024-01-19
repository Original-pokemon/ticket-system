import type { Context } from "#root/bot/context.ts";
import { logHandle } from "#root/bot/helpers/index.ts";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import { showTicketsForPetrolStationHandler } from "#root/bot/handlers/index.ts";
import { PetrolStationButtons } from "#root/bot/const/index.ts";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.hears(
  PetrolStationButtons.AllTickets,
  logHandle("hears-all-tickets-for-petrol-station"),
  chatAction("typing"),
  showTicketsForPetrolStationHandler,
);

export { composer as petrolStationFeature };
