import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/index.js";
import { Composer } from "grammy";
import { welcomeCommandHandler } from "../handlers/commands/welcome.js";
import { helpCommandHandler } from "../handlers/commands/help.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("start", logHandle("command-start"), welcomeCommandHandler);
feature.command("help", logHandle("command-help"), helpCommandHandler);

export { composer as commandsFeature };
