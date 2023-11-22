import { selectPetrolStationData } from "#root/bot/callback-data/admin/select/select-petrol-station.js";
import { saveRelationshipData } from "#root/bot/callback-data/index.js";
import { AdminText } from "#root/bot/const/text.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/keyboard.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";

export const createPetrolStationKeyboard = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const petrolStations = await ctx.services.PetrolStation.getAll();
  const { customData, selectUser } = ctx.session;

  if (!selectUser) {
    throw new Error("User not Selected");
  }

  const keyboard = InlineKeyboard.from(
    chunk(
      petrolStations.map(({ user }) => {
        if (user) {
          const { id, user_name: userName } = user;
          const text = customData[id.toString()] ? `✅${userName}` : userName;

          return {
            text,
            callback_data: selectPetrolStationData.pack({
              id: id.toString(),
            }),
          };
        }
        throw new Error("don`t find user information");
      }),
      2,
    ),
  );

  keyboard
    .row()
    .text(
      AdminText.Keyboard.SAVE,
      saveRelationshipData.pack({ id: selectUser }),
    );
  return keyboard;
};
