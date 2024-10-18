/* eslint-disable unicorn/no-null */
import { Middleware } from "grammy";
import { config } from "#root/config.js";
import { Context } from "../context.js";
import { UserGroup, BotText } from "../const/index.js";
import { getProfileText } from "../helpers/index.js";

async function getUser(ctx: Context, id: string) {
  try {
    return await ctx.services.User.getUnique(id);
  } catch {
    return null;
  }
}

async function createUser(
  ctx: Context,
  id: string,
  firstName: string,
  lastName: string | undefined,
  login: string | undefined,
) {
  const userName = `${firstName.replaceAll(" ", "")}${
    lastName ? `_${lastName}` : ""
  }`;
  const group = config.BOT_ADMIN_USER_ID.includes(Number.parseInt(id, 10))
    ? UserGroup.Admin
    : UserGroup.Unauthorized;

  try {
    const userId = await ctx.services.User.create({
      id,
      user_name: userName,
      first_name: firstName,
      last_name: lastName,
      user_group: group,
      login,
    });

    const newUser = await ctx.services.User.getUnique(userId);
    const adminMessages = config.BOT_ADMIN_USER_ID.map((adminId) => {
      const text = `Новый пользователь! \n${getProfileText(newUser)}`;
      return ctx.api.sendMessage(adminId, text);
    });

    await Promise.all(adminMessages);
    return newUser;
  } catch (error) {
    ctx.logger.error(`Failed to create user: ${error}`);
    throw error;
  }
}

async function updateUserIfNeeded(
  ctx: Context,
  userId: string,
  firstName: string,
  lastName: string | undefined,
  login: string | undefined,
) {
  try {
    const user = await ctx.services.User.getUnique(userId);

    // Приводим undefined к null для корректного сравнения
    const newLastName = lastName ?? null;
    const newLogin = login ?? null;

    if (
      user.first_name !== firstName ||
      user.last_name !== newLastName ||
      user.login !== newLogin
    ) {
      const updatedUser = await ctx.services.User.update({
        ...user,
        login,
        first_name: firstName,
        last_name: lastName,
      });

      return updatedUser;
    }

    return user;
  } catch (error) {
    ctx.logger.error(`Failed to update user: ${error}`);
    throw error;
  }
}

export function authMiddleware(): Middleware<Context> {
  return async (ctx, next) => {
    const {
      id,
      first_name: firstName,
      last_name: lastName,
      username,
    } = ctx.from || {};

    if (!id || !firstName) {
      ctx.logger.warn("Authorization failed: Missing id or first name.");
      return;
    }

    try {
      let user = await getUser(ctx, id.toString());

      user = await (user
        ? updateUserIfNeeded(ctx, id.toString(), firstName, lastName, username)
        : createUser(ctx, id.toString(), firstName, lastName, username));

      ctx.session.user = user;

      if (user.user_group === UserGroup.Blocked) {
        return ctx.reply(BotText.Welcome.BLOCKED);
      }

      return next();
    } catch (error) {
      ctx.logger.error(`authMiddleware: ${error}`);
      return ctx.reply("An error occurred during the authorization process.");
    }
  };
}
