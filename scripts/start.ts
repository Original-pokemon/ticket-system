#!/usr/bin/env tsx

import { createBot } from "#root/bot/index.js";
import { createAppContainer } from "#root/container.js";
import { PsqlAdapter } from "@grammyjs/storage-psql";

import { run, RunnerHandle } from "@grammyjs/runner";
import { createApi } from "#root/services/api.js";

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
  const api = await createApi();
  const container = createAppContainer(api);
  const { logger, config, client } = container;
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
    logger.debug("shutdown");
    logger.info("Stopping bot...");
    await bot.stop();
    logger.debug("Closing database connection...");
    await client.end();

    if (config.isProd) {
      logger.debug("Stopping runner...");
      await runner?.stop();
    }
    logger.info("Shutdown complete.");
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
} catch {
  process.exit(1);
}
