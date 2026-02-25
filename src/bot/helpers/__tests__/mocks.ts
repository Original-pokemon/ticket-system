import { Context } from "#root/bot/context.js";
import { TicketType, CategoryType, PetrolStationType } from "#root/types/index.js";

export const createMockLogger = () => ({
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
  fatal: vi.fn(),
});

export const createMockApi = () => ({
  sendMessage: vi.fn().mockResolvedValue({ message_id: 123 }),
});

export const createMockCategoryService = (taskPerformers: string[] = []) => ({
  getUnique: vi.fn().mockResolvedValue({
    id: "cat-1",
    description: "Test Category",
    task_performers: taskPerformers,
  } as CategoryType),
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const createMockPetrolStationService = (managers: string[] = []) => ({
  getUnique: vi.fn().mockResolvedValue({
    id: "ps-1",
    user_name: "Test Station",
    managers,
  } as PetrolStationType),
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const createMockServices = (
  taskPerformers: string[] = [],
  managers: string[] = [],
) => ({
  Category: createMockCategoryService(taskPerformers),
  PetrolStation: createMockPetrolStationService(managers),
  User: {} as any,
  Manager: {} as any,
  TaskPerformer: {} as any,
  Ticket: {} as any,
  Group: {} as any,
  Status: {} as any,
  Bush: {} as any,
});

export const createMockSession = () => ({
  categories: {
    data: {
      "cat-1": {
        id: "cat-1",
        description: "Test Category",
        task_performers: ["user-1", "user-2"],
      },
    },
    lastUpdate: Date.now(),
  },
  groups: { data: {}, lastUpdate: Date.now() },
  statuses: { data: {}, lastUpdate: Date.now() },
  user: {
    id: "user-1",
    user_group: "task_performer",
    user_name: "Test User",
  },
  customData: {},
});

export const createMockContext = (
  taskPerformers: string[] = [],
  managers: string[] = [],
): Partial<Context> => ({
  logger: createMockLogger() as any,
  api: createMockApi() as any,
  services: createMockServices(taskPerformers, managers) as any,
  session: createMockSession() as any,
});

export const createMockTicket = (overrides?: Partial<TicketType>): TicketType => ({
  id: "ticket-1",
  title: "Test Ticket",
  description: "Test Description",
  petrol_station_id: "ps-1",
  ticket_category: "cat-1",
  status_id: "1",
  priority: "medium",
  created_at: new Date(),
  attachments: [],
  comments: [],
  status_history: [],
  ...overrides,
});
