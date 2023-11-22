import { saveRelationshipData } from "#root/bot/callback-data/index.js";
import { AdminText } from "#root/bot/const/text.js";
import { UserGroup } from "#root/bot/const/user-group.js";
import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";

export const saveRelationshipHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { id } = saveRelationshipData.unpack(ctx.callbackQuery.data);
  const {
    session: { customData },
    services: { PetrolStation, Manager, User },
  } = ctx;
  const { user_group: userGroup } = await User.getUnique(id);
  const saveItems = Object.entries(customData)
    .filter(([_key, value]) => value)
    .map(([key]) => key);

  if (userGroup === UserGroup.Manager) {
    const manager = await Manager.getUnique(id.toString());
    await Manager.update({ ...manager, petrol_stations: saveItems });
  } else {
    const petrolStation = await PetrolStation.getUnique(id.toString());
    await PetrolStation.update({
      ...petrolStation,
      managers: saveItems,
    });
  }

  ctx.editMessageText(AdminText.AdminCommand.SAVE_RELATIONSHIP);
};
