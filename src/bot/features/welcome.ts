import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/index.js";
import { Composer } from "grammy";
import { welcomeCommandHandler } from "../handlers/commands/welcome.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("start", logHandle("command-start"), welcomeCommandHandler);

export { composer as welcomeFeature };
