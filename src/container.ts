import pg from "pg";
import { config } from "#root/config.js";
import { logger } from "#root/logger.js";
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
} from "#root/services/index.js";

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

const createClient = (connectionString: string) =>
  new pg.Client(connectionString);

export const createAppContainer = () => {
  const { DATABASE_URL } = config;

  const client = createClient(DATABASE_URL);

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
