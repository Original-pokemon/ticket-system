import { Context } from "#root/bot/context.js";
import {
  REGISTER_USER_CONVERSATION,
  FIND_USER_CONVERSATION,
} from "#root/bot/conversations/index.js";
import { CallbackQueryContext, InlineKeyboard, HearsContext } from "grammy";
import {
  selectCategoryAdminData,
  unBlockUserData,
  blockUserData,
  registerUserData,
  setRelationshipUserData,
  selectUserData,
} from "#root/bot/callback-data/index.js";
import { AdminText, UserGroup } from "#root/bot/const/index.js";

import { ServicesType } from "#root/container.js";
import {
  isBlocked,
  isUnauthorized,
  isAuthUser,
} from "#root/bot/filters/index.js";
import { getProfileText } from "#root/bot/helpers/index.js";

export const registerUserHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  await ctx.conversation.enter(REGISTER_USER_CONVERSATION);
};

export const saveCategoryHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const {
    callbackQuery,
    session: { selectUser },
    services: { TaskPerformer },
  } = ctx;
  // eslint-disable-next-line camelcase
  const { id: category_id } = selectCategoryAdminData.unpack(
    callbackQuery.data,
  );

  if (!selectUser) {
    throw new Error("User not Selected");
  }
  const taskPerformer = await TaskPerformer.getUnique(selectUser);

  await TaskPerformer.update({
    ...taskPerformer,
    // eslint-disable-next-line camelcase
    category_id,
  });

  await ctx.editMessageText(AdminText.Admin.SAVE_RELATIONSHIP);
};

export const unblockUserHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { id } = unBlockUserData.unpack(ctx.callbackQuery.data);
  const user = await ctx.services.User.getUnique(id);

  await ctx.services.User.update({
    ...user,
    user_group: UserGroup.Unauthorized,
  });

  await ctx.reply(AdminText.Unblock.USER_UNBLOCK);
  await ctx.api.sendMessage(user.id, AdminText.Unblock.USER_MESSAGE);
};

export const blockUserHandler = async (ctx: CallbackQueryContext<Context>) => {
  const { id } = blockUserData.unpack(ctx.callbackQuery.data);
  const user = await ctx.services.User.getUnique(id);

  await ctx.services.User.update({
    ...user,
    user_group: UserGroup.Blocked,
  });

  await ctx.reply(AdminText.Block.USER_BLOCK);
  await ctx.api.sendMessage(user.id, AdminText.Block.USER_MESSAGE);
};

export const viewUserProfileHandler = async (
  ctx: Context,
  services: ServicesType,
  id: string,
) => {
  try {
    const user = await services.User.getUnique(id);
    const { user_group: userGroup } = user;

    const keyboard = new InlineKeyboard();

    if (isUnauthorized(userGroup)) {
      keyboard.text("Выдать доступ", registerUserData.pack({ id: user.id }));
    } else if (isBlocked(userGroup)) {
      keyboard.text("Разблокировать", unBlockUserData.pack({ id: user.id }));
    } else {
      keyboard.text("Изменить данные", registerUserData.pack({ id: user.id }));
      keyboard.text("Заблокировать", blockUserData.pack({ id: user.id }));
    }

    if (isAuthUser(userGroup)) {
      keyboard.text(
        "Настроить связи",
        setRelationshipUserData.pack({ id: user.id }),
      );
    }

    const text = getProfileText(user);

    return ctx.reply(text, {
      reply_markup: keyboard,
    });
  } catch {
    await ctx.reply(AdminText.FindUser.NOT_FOUND);
  }
};

export const selectUserHandler = async (ctx: CallbackQueryContext<Context>) => {
  const { id } = selectUserData.unpack(ctx.callbackQuery.data);

  await viewUserProfileHandler(ctx, ctx.services, id);
};

export const findUserCommandHandler = async (ctx: HearsContext<Context>) => {
  return ctx.conversation.enter(FIND_USER_CONVERSATION);
};
