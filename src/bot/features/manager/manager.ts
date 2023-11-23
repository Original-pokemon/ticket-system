import type { Context } from "#root/bot/context.ts";
import { logHandle } from "#root/bot/helpers/logging.ts";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import { ManagerButtons } from "#root/bot/const/buttons/manager-buttons.ts";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.hears(
  ManagerButtons.CreateTicket,
  logHandle("hears-create-ticket"),
  chatAction("typing"),
  // findUserCommandHandler,
);
