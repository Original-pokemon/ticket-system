import { AdminButton } from "#root/bot/const/buttons/admin-buttons.ts";
import { chunk } from "#root/bot/helpers/keyboard.ts";
import { Keyboard } from "grammy";

const buttons = Object.values(AdminButton);

export const createAdminKeyboard = async () => Keyboard.from(chunk(buttons, 2));
