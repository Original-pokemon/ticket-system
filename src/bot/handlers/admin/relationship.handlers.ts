import {
  setRelationshipUserData,
  saveRelationshipData,
  selectPetrolStationAdminData,
  selectManagerData,
  selectCategoryAdminData,
} from "#root/bot/callback-data/index.js";
import { AdminText, UserGroup } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import {
  createPetrolStationsMultiKeyboard,
  createManagersKeyboard,
  createCategoriesRelationKeyboard,
} from "#root/bot/keyboards/index.js";
import { ManagerType } from "#root/types/manager.js";
import { PetrolStationType } from "#root/types/petrol-station.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";

const getCustomArray = (array: string[]) => array.map((item) => [item, true]);

export const setUpRelationshipHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { id } = setRelationshipUserData.unpack(ctx.callbackQuery.data);
  const { User, Manager, PetrolStation, TaskPerformer } = ctx.services;
  const { user_group: userGroup } = await User.getUnique(id);
  ctx.session.selectUser = id.toString();

  let keyboard: InlineKeyboard;

  switch (userGroup) {
    case UserGroup.Manager: {
      const manager = (await Manager.getUnique(
        id.toString(),
      )) as ManagerType & {
        petrol_stations: PetrolStationType[];
      };

      if (!manager.petrol_stations) {
        throw new Error("petrol station not found");
      }

      const petrolStationsCustom = getCustomArray(
        manager.petrol_stations.map(
          ({ id: petrolStationId }) => petrolStationId,
        ),
      );

      ctx.session.customData = Object.fromEntries(petrolStationsCustom);

      keyboard = await createPetrolStationsMultiKeyboard(ctx);
      break;
    }
    case UserGroup.PetrolStation: {
      const petrolStation = await PetrolStation.getUnique(id.toString());

      if (!petrolStation.managers) {
        throw new Error("managers not found");
      }

      const managersCustom = getCustomArray(petrolStation.managers);

      ctx.session.customData = Object.fromEntries(managersCustom);

      keyboard = await createManagersKeyboard(ctx);
      break;
    }
    case UserGroup.TaskPerformer: {
      const { category: categoryIdList } = await TaskPerformer.getUnique(
        id.toString(),
      );

      // if (!categoryIdList) {
      //   throw new Error("categories not found");
      // }

      const categoriesCustom = getCustomArray(categoryIdList || []);

      ctx.session.customData = Object.fromEntries(categoriesCustom);

      keyboard = await createCategoriesRelationKeyboard(ctx);
      break;
    }
    default: {
      throw new Error(`Invalid user group`);
    }
  }

  await ctx.editMessageText(AdminText.Admin.USERS, {
    reply_markup: keyboard,
  });
};

export const saveRelationshipHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { id } = saveRelationshipData.unpack(ctx.callbackQuery.data);
  const {
    session,
    services: { PetrolStation, Manager, User, TaskPerformer },
  } = ctx;
  const { user_group: userGroup } = await User.getUnique(id);
  const saveItems = Object.entries(session.customData)
    .filter(([_key, value]) => value)
    .map(([key]) => key);

  switch (userGroup) {
    case UserGroup.Manager: {
      const manager = await Manager.getUnique(id.toString());
      await Manager.update({ ...manager, petrol_stations: saveItems });
      break;
    }
    case UserGroup.PetrolStation: {
      const petrolStation = await PetrolStation.getUnique(id.toString());
      await PetrolStation.update({
        ...petrolStation,
        managers: saveItems,
      });
      break;
    }
    case UserGroup.TaskPerformer: {
      const taskPerformer = await TaskPerformer.getUnique(id.toString());

      await TaskPerformer.update({
        ...taskPerformer,
        category: saveItems,
      });
      break;
    }
    default: {
      throw new Error(`Invalid user group`);
    }
  }

  ctx.editMessageText(AdminText.Admin.SAVE_RELATIONSHIP);
};

export const selectPetrolStationsHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { callbackQuery, session } = ctx;
  const { id } = selectPetrolStationAdminData.unpack(callbackQuery.data);

  if (id in session.customData) {
    delete session.customData[id];
  } else {
    session.customData[id] = true;
  }
  await ctx.editMessageText(AdminText.Admin.USERS, {
    reply_markup: await createPetrolStationsMultiKeyboard(ctx),
  });
};

export const selectManagersHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { callbackQuery, session } = ctx;
  const { id } = selectManagerData.unpack(callbackQuery.data);

  if (id in session.customData) {
    delete session.customData[id];
  } else {
    session.customData[id] = true;
  }
  await ctx.editMessageText(AdminText.Admin.USERS, {
    reply_markup: await createManagersKeyboard(ctx),
  });
};

export const selectСategoryHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { callbackQuery, session } = ctx;
  const { id } = selectCategoryAdminData.unpack(callbackQuery.data);

  if (id in session.customData) {
    delete session.customData[id];
  } else {
    session.customData[id] = true;
  }
  await ctx.editMessageText(AdminText.Admin.USERS, {
    reply_markup: await createCategoriesRelationKeyboard(ctx),
  });
};
