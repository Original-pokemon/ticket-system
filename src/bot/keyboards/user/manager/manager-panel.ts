import { ManagerButtons } from "#root/bot/const/index.js";
import { chunk } from "#root/bot/helpers/index.js";
import { Keyboard } from "grammy";

const buttons = Object.values(ManagerButtons);

export const createManagerKeyboard = async () =>
  Keyboard.from(chunk(buttons, 2));
