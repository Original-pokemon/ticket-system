import { BotText, UserGroup } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { isAdmin, isBlocked, isUnauthorized } from "#root/bot/filters/index.js";
import { CommandContext } from "grammy";

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

export const helpCommandHandler = async (ctx: CommandContext<Context>) => {
  const { session, conversation } = ctx;

  const {
    user: { user_group: userGroup },
    groups: { data: cachedGroups },
  } = session;

  if (!cachedGroups) {
    throw new Error("Gropes not found");
  }

  await conversation.exit();

  if (isAdmin(userGroup) || isUnauthorized(userGroup) || isBlocked(userGroup)) {
    return;
  }

  const messageText = BotText.HELP(ManualLink[userGroup], SiteLink[userGroup]);

  return ctx.reply(messageText);
};
