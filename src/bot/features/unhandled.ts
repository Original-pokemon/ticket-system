import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { BotText } from "../const/text.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.on("message", logHandle("unhandled-message"), (ctx) => {
  return ctx.reply(BotText.UNHANDLER);
});

feature.on("callback_query", logHandle("unhandled-callback-query"), (ctx) => {
  return ctx.answerCallbackQuery();
});

export { composer as unhandledFeature };
