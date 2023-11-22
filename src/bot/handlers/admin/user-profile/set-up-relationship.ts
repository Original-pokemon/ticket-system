import { setRelationshipUserData } from "#root/bot/callback-data/admin/set-relationship-user.js";
import { AdminText } from "#root/bot/const/text.js";
import { UserGroup } from "#root/bot/const/user-group.js";
import { Context } from "#root/bot/context.js";
import {
  createPetrolStationKeyboard,
  createManagerKeyboard,
  createCategoriesKeyboard,
} from "#root/bot/keyboards/index.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";

const getCustomArray = (array: string[]) => array.map((item) => [item, true]);

export const setUpRelationshipHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { id } = setRelationshipUserData.unpack(ctx.callbackQuery.data);
  const { User, Manager, PetrolStation } = ctx.services;
  const { user_group: userGroup } = await User.getUnique(id);
  ctx.session.selectUser = id.toString();

  let keyboard: InlineKeyboard;

  switch (userGroup) {
    case UserGroup.Manager: {
      const manager = await Manager.getUnique(id.toString());

      if (!manager.petrol_stations) {
        throw new Error("petrol station not found");
      }

      const petrolStationsCustom = getCustomArray(manager.petrol_stations);

      ctx.session.customData = Object.fromEntries(petrolStationsCustom);

      keyboard = await createPetrolStationKeyboard(ctx);
      break;
    }
    case UserGroup.PetrolStation: {
      const petrolStation = await PetrolStation.getUnique(id.toString());

      if (!petrolStation.managers) {
        throw new Error("managers not found");
      }

      const managersCustom = getCustomArray(petrolStation.managers);

      ctx.session.customData = Object.fromEntries(managersCustom);

      keyboard = await createManagerKeyboard(ctx);
      break;
    }
    case UserGroup.TaskPerformer: {
      keyboard = await createCategoriesKeyboard(ctx);
      break;
    }
    default: {
      throw new Error(`Invalid user group`);
    }
  }

  await ctx.editMessageText(AdminText.AdminCommand.USERS, {
    reply_markup: keyboard,
  });
};
