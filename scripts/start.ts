#!/usr/bin/env tsx

import { createBot } from "#root/bot/index.js";
import { createAppContainer } from "#root/container.js";
import { PsqlAdapter } from "@grammyjs/storage-psql";

import { run, RunnerHandle } from "@grammyjs/runner";

const container = createAppContainer();
const { logger, config, client } = container;
function onShutdown(cleanUp: () => Promise<void>) {
  let isShuttingDown = false;
  const handleShutdown = async () => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    await cleanUp();
  };
  process.on("SIGINT", handleShutdown);
  process.on("SIGTERM", handleShutdown);
}

try {
  await client.connect();
  const sessionStorage = await PsqlAdapter.create({
    tableName: "session",
    client,
  });

  const bot = createBot(config.BOT_TOKEN, {
    container,
    sessionStorage,
  });

  let runner: undefined | RunnerHandle;

  // Graceful shutdown
  onShutdown(async () => {
    logger.info("shutdown");

    await runner?.stop();
    await bot.stop();
  });

  await Promise.all([bot.init()]);

  if (config.isProd) {
    logger.info({
      msg: "bot running...",
      username: bot.botInfo.username,
    });

    runner = run(bot, {
      runner: {
        fetch: {
          allowed_updates: config.BOT_ALLOWED_UPDATES,
        },
      },
    });
  } else if (config.isDev) {
    await bot.start({
      allowed_updates: config.BOT_ALLOWED_UPDATES,
      onStart: ({ username }) =>
        logger.info({
          msg: "bot running...",
          username,
        }),
    });
  }
} catch (error) {
  logger.error(error);
  process.exit(1);
}
