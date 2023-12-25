import { AdminButton } from "#root/bot/const/index.ts";
import { chunk } from "#root/bot/helpers/index.ts";
import { Keyboard } from "grammy";

const buttons = Object.values(AdminButton);

export const createAdminKeyboard = async () => Keyboard.from(chunk(buttons, 2));
