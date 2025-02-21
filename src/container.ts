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
import { AxiosInstance } from "axios";

const createServices = (api: AxiosInstance) => ({
  Group: new GroupService(api),
  User: new UserService(api),
  Manager: new ManagerService(api),
  Bush: new BushService(api),
  PetrolStation: new PetrolStationService(api),
  TaskPerformer: new TaskPerformerService(api),
  Category: new CategoryService(api),
  Attachment: new AttachmentService(api),
  Comment: new CommentService(api),
  Priority: new PriorityService(api),
  StatusHistory: new StatusHistoryService(api),
  Status: new StatusService(api),
  TagWord: new TagWordService(api),
  Ticket: new TicketService(api),
});

const createClient = (connectionString: string) =>
  new pg.Client(connectionString);

export const createAppContainer = (api: AxiosInstance) => {
  const { DATABASE_URL } = config;

  const client = createClient(DATABASE_URL);

  const services = createServices(api);

  return {
    client,
    config,
    logger,
    services,
  };
};

export type ServicesType = ReturnType<typeof createServices>;

export type Container = ReturnType<typeof createAppContainer>;
