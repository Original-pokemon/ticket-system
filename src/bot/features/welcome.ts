import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/index.js";
import { Composer } from "grammy";
import { welcomeCommandHandler } from "../handlers/commands/welcome.js";
import { welcomeCallbackHandler } from "../handlers/index.js";
import { startMessageCallback } from "../callback-data/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("start", logHandle("command-start"), welcomeCommandHandler);

feature.callbackQuery(startMessageCallback.filter(), welcomeCallbackHandler);

export { composer as welcomeFeature };
