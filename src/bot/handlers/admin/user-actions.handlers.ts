import { Context } from "#root/bot/context.js";
import {
  REGISTER_USER_CONVERSATION,
  FIND_USER_CONVERSATION,
} from "#root/bot/conversations/index.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";
import {
  selectCategoryAdminData,
  unBlockUserData,
  blockUserData,
  registerUserData,
  setRelationshipUserData,
  selectUserData,
  adminShowTickets,
} from "#root/bot/callback-data/index.js";
import { AdminText, UserGroup } from "#root/bot/const/index.js";

import {
  isBlocked,
  isUnauthorized,
  isAuthUser,
} from "#root/bot/filters/index.js";
import { chunk, getProfileText } from "#root/bot/helpers/index.js";

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

export const viewUserProfileHandler = async (ctx: Context, id: string) => {
  const { session, services } = ctx;

  try {
    const user = await services.User.getUnique(id);

    if (session.users) {
      // eslint-disable-next-line unicorn/no-null
      session.users = null;
    }
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

    try {
      await ctx.editMessageText(text, {
        reply_markup: keyboard,
      });
    } catch {
      await ctx.reply(text, {
        reply_markup: keyboard,
      });
    }
  } catch {
    await ctx.reply(AdminText.FindUser.NOT_FOUND);
  }
};

export const selectUserHandler = async (ctx: CallbackQueryContext<Context>) => {
  const {
    callbackQuery: { data },
  } = ctx;
  const { id } = selectUserData.unpack(data);

  await viewUserProfileHandler(ctx, id);
};

export const findUserCommandHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  return ctx.conversation.enter(FIND_USER_CONVERSATION);
};

export async function viewAllGroupsCommandHandler(ctx: Context) {
  const groups = ctx.session.groups
    ? Object.values(ctx.session.groups)
    : await ctx.services.Category.getAll();

  if (!groups || groups.length === 0) {
    await ctx.reply("Нет доступных категорий.");
    return;
  }

  const keyboard = InlineKeyboard.from(
    chunk(
      groups.map((category) => ({
        text: category.description,
        callback_data: adminShowTickets.pack({
          groupId: category.id,
          pageIndex: 0,
        }),
      })),
      2,
    ),
  );

  if (ctx.session.users) {
    // eslint-disable-next-line unicorn/no-null
    ctx.session.users = null;
  }

  await ctx.reply("Выберите категорию:", {
    reply_markup: keyboard,
  });
}
