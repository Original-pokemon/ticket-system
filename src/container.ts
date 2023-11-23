import { config } from "#root/config.ts";
import { logger } from "#root/logger.ts";
import {
  UserService,
  GroupService,
  PetrolStationService,
  TaskPerformerService,
  BushService,
  ManagerService,
  CategoryService,
  AttachmentService,
  CommentService,
  PriorityService,
  StatusHistoryService,
  StatusService,
  TagWordService,
  TicketService,
} from "#root/services/index.ts";

import pg from "pg";

const createServices = () => ({
  User: new UserService(),
  Group: new GroupService(),
  Manager: new ManagerService(),
  Bush: new BushService(),
  PetrolStation: new PetrolStationService(),
  TaskPerformer: new TaskPerformerService(),
  Category: new CategoryService(),
  Attachment: new AttachmentService(),
  Comment: new CommentService(),
  Priority: new PriorityService(),
  StatusHistory: new StatusHistoryService(),
  Status: new StatusService(),
  TagWord: new TagWordService(),
  Ticket: new TicketService(),
});

type ClientConfigType = {
  database: string;
  user: string;
  password: string;
  host: string;
  port: number;
};

const createClient = (clientConfig: ClientConfigType) =>
  new pg.Client(clientConfig);

export const createAppContainer = () => {
  const { DATA_BASE_HOST, DATA_BASE_PORT, DATA_BASE_USER, DATA_BASE_PASSWORD } =
    config;
  const clientConfig = {
    database: "postgres",
    user: DATA_BASE_USER,
    password: DATA_BASE_PASSWORD,
    host: DATA_BASE_HOST,
    port: DATA_BASE_PORT,
  };

  const client = createClient(clientConfig);

  const services = createServices();

  return {
    client,
    config,
    logger,
    services,
  };
};

export type ServicesType = ReturnType<typeof createServices>;

export type Container = ReturnType<typeof createAppContainer>;
