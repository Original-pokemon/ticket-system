import type { Context } from "#root/bot/context.ts";
import { logHandle } from "#root/bot/helpers/index.ts";
import { Composer } from "grammy";
import { welcomeCommandHandler } from "../handlers/commands/welcome.ts";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("start", logHandle("command-start"), welcomeCommandHandler);

export { composer as welcomeFeature };
