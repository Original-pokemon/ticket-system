/* eslint-disable camelcase */
import { InlineKeyboard } from "grammy";
import {
  registerUserData,
  unBlockUserData,
  blockUserData,
  setRelationshipUserData,
} from "#root/bot/callback-data/index.ts";

import { ServicesType } from "#root/container.ts";
import { isBlocked, isUnauthorized, isUser } from "#root/bot/filters/index.ts";
import { getProfileText } from "#root/bot/helpers/user-profile.ts";
import { AdminText } from "#root/bot/const/text.ts";
import { Context } from "../../context.ts";

export const viewUserProfileHandler = async (
  ctx: Context,
  services: ServicesType,
  id: string,
) => {
  try {
    const user = await services.User.getUnique(id);
    const { user_group } = user;

    const keyboard = new InlineKeyboard();

    if (isUnauthorized(user_group)) {
      keyboard.text("Выдать доступ", registerUserData.pack({ id: user.id }));
    } else if (isBlocked(user_group)) {
      keyboard.text("Разблокировать", unBlockUserData.pack({ id: user.id }));
    } else {
      keyboard.text("Изменить данные", registerUserData.pack({ id: user.id }));
      keyboard.text("Заблокировать", blockUserData.pack({ id: user.id }));
    }

    if (isUser(user_group)) {
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
