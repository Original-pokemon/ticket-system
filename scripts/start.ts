#!/usr/bin/env tsx

import { createBot } from "#root/bot/index.js";
import { createAppContainer } from "#root/container.js";
import { onShutdown } from "node-graceful-shutdown";

const container = createAppContainer();
const { logger, config, client } = container;

try {
  await client.connect();
  const bot = createBot(config.BOT_TOKEN, {
    container,
  });

  // Graceful shutdown
  onShutdown(async () => {
    logger.info("shutdown");

    await server.close();
    await bot.stop();
  });

  if (config.isProd) {
    // to prevent receiving updates before the bot is ready
    await bot.init();

    await server.listen({
      host: config.BOT_SERVER_HOST,
      port: config.BOT_SERVER_PORT,
    });

    await bot.api.setWebhook(config.BOT_WEBHOOK, {
      allowed_updates: config.BOT_ALLOWED_UPDATES,
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
