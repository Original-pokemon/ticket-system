import { selectPetrolStationData } from "#root/bot/callback-data/admin/select/select-petrol-station.ts";
import { saveRelationshipData } from "#root/bot/callback-data/index.ts";
import { AdminText } from "#root/bot/const/text.ts";
import { Context } from "#root/bot/context.ts";
import { chunk } from "#root/bot/helpers/keyboard.ts";
import { CallbackQueryContext, InlineKeyboard } from "grammy";

export const createPetrolStationsKeyboard = async (
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
