import { PetrolStationButtons } from "#root/bot/const/index.js";
import { chunk } from "#root/bot/helpers/keyboard.js";
import { InlineKeyboard, Keyboard } from "grammy";

const buttons = Object.values(PetrolStationButtons);

export const createPetrolStationKeyboard = async () =>
  Keyboard.from(chunk(buttons, 2));

export const createPetrolStationInlineKeyboard = async () => {
  const keyboard = InlineKeyboard.from([
    [{ text: PetrolStationButtons.CreateTicket, callback_data: "" }],
  ]);

  return keyboard;
};
