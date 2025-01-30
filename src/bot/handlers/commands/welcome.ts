import { Context } from "#root/bot/context.js";
import { CommandContext } from "grammy";
import { createAdminStartMenu } from "#root/bot/keyboards/admin/admin-panel.js";
import { isBlocked, isUnauthorized } from "#root/bot/filters/index.js";
import { isAdmin } from "#root/bot/filters/is-bot-admin.js";
import { BotText } from "#root/bot/const/text.js";
import { createUserKeyboard } from "#root/bot/keyboards/user/user-panel.js";
import { UserGroup } from "#root/bot/const/index.js";

const ManualLink = {
  [UserGroup.Manager]:
    "https://docs.google.com/document/d/1BWeWQpULb50uoNuwiIy9DObpAgiDqod4ZU5tEpjB8sw/edit?usp=sharing",
  [UserGroup.TaskPerformer]:
    "https://docs.google.com/document/d/1yN6J4oRBB1gWGFi84qz17zwSMBBmgzRyBr_bLHrBxmE/edit?usp=sharing",
  [UserGroup.PetrolStation]:
    "https://docs.google.com/document/d/1U_e3LDDGC_yzuShJIGSJI1tdLtjrQeZgufUbMpNbaIQ/edit?usp=sharing",
  [UserGroup.Supervisor]:
    "https://docs.google.com/document/d/15PT1L9n5tTtmnewRu_Mz9mnNHWR8AvgMt3AcHfXvba0/edit?usp=sharing",
};

const SiteLink = {
  [UserGroup.Manager]:
    "https://docs.google.com/document/d/1BTxTL7e7u5SCiCK39Zs_9BonVY9sd_j5pAzmqZfWP4U/edit?usp=sharing",
  [UserGroup.TaskPerformer]:
    "https://docs.google.com/document/d/1BTxTL7e7u5SCiCK39Zs_9BonVY9sd_j5pAzmqZfWP4U/edit?usp=sharing",
  [UserGroup.PetrolStation]: undefined,
  [UserGroup.Supervisor]:
    "https://docs.google.com/document/d/1BTxTL7e7u5SCiCK39Zs_9BonVY9sd_j5pAzmqZfWP4U/edit?usp=sharing",
};

export const welcomeCommandHandler = async (ctx: CommandContext<Context>) => {
  const { session, conversation } = ctx;

  const {
    user: { user_group: userGroup },
    groups: { data: cachedGroups },
  } = session;

  if (!cachedGroups) {
    throw new Error("Gropes not found");
  }
  const group = cachedGroups[userGroup];

  await conversation.exit();

  if (isAdmin(userGroup)) {
    return ctx.reply(BotText.Welcome.ADMIN, {
      reply_markup: createAdminStartMenu(),
    });
  }
  if (isUnauthorized(userGroup)) {
    return ctx.reply(BotText.Welcome.UNAUTHORIZED);
  }

  if (isBlocked(userGroup)) {
    return ctx.reply(BotText.Welcome.BLOCKED);
  }

  return ctx.reply(
    BotText.Welcome.getUserText(
      group.description,
      ManualLink[userGroup],
      SiteLink[userGroup],
    ),
    {
      reply_markup: await createUserKeyboard(group.id),
    },
  );
};
