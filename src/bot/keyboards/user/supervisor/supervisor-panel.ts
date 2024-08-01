import { SupervisorButtons } from "#root/bot/const/index.js";
import { chunk } from "#root/bot/helpers/keyboard.js";
import { Keyboard } from "grammy";

const buttons = Object.values(SupervisorButtons);

export const createSupervisorKeyboard = async () =>
  Keyboard.from(chunk(buttons, 2));
