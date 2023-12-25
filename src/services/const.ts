// eslint-disable-next-line no-shadow
export enum ApiRouteKey {
  Group = "Group",
  Bush = "Bush",
  User = "User",
  TaskPerformer = "TaskPerformer",
  Manager = "Manager",
  PetrolStation = "PetrolStation",
  Category = "Category",
  Attachment = "Attachment",
  Comment = "Comment",
  Priority = "Priority",
  StatusHistory = "StatusHistory",
  Status = "Status",
  TagWord = "TagWord",
  Ticket = "Ticket",
}

export const APIRoute = {
  [ApiRouteKey.Group]: {
    All: "/groups",
    Many: undefined,
    Info: (id: string) => `/group/${id}`,
    Create: undefined,
    Update: undefined,
    Delete: undefined,
  },
  [ApiRouteKey.Category]: {
    All: "/categories",
    Many: undefined,
    Info: (id: string) => `/category/${id}`,
    Create: undefined,
    Update: undefined,
    Delete: undefined,
  },
  [ApiRouteKey.Bush]: {
    All: "/bushes",
    Many: undefined,
    Info: (id: string) => `/bush/${id}`,
    Create: undefined,
    Update: undefined,
    Delete: undefined,
  },
  [ApiRouteKey.User]: {
    All: "/users",
    Many: `/users/select`,
    Info: (id: string) => `/user/${id}`,
    Create: "/user/create",
    Update: (id: string) => `/user/update/${id}`,
    Delete: (id: string) => `/user/delete/${id}`,
  },
  [ApiRouteKey.TaskPerformer]: {
    All: "/task-performers",
    Many: undefined,
    Info: (id: string) => `/task-performer/${id}`,
    Create: "/task-performer/create",
    Update: (id: string) => `/task-performer/update/${id}`,
    Delete: (id: string) => `/task-performer/delete/${id}`,
  },
  [ApiRouteKey.Manager]: {
    All: "/managers",
    Many: undefined,
    Info: (id: string) => `/manager/${id}`,
    Create: "/manager/create",
    Update: (id: string) => `/manager/update/${id}`,
    Delete: (id: string) => `/manager/delete/${id}`,
  },
  [ApiRouteKey.PetrolStation]: {
    All: "/petrol-stations",
    Many: undefined,
    Info: (id: string) => `/petrol-station/${id}`,
    Create: "/petrol-station/create",
    Update: (id: string) => `/petrol-station/update/${id}`,
    Delete: (id: string) => `/petrol-station/delete/${id}`,
  },
  [ApiRouteKey.Attachment]: {
    All: "/attachments",
    Many: "/attachments/select",
    Info: (id: string) => `/attachment/${id}`,
    Create: "/attachment/create",
    Update: (id: string) => `/attachment/update/${id}`,
    Delete: (id: string) => `/attachment/delete/${id}`,
  },
  [ApiRouteKey.Comment]: {
    All: "/comments",
    Many: undefined,
    Info: (id: string) => `/comment/${id}`,
    Create: "/comment/create",
    Update: (id: string) => `/comment/update/${id}`,
    Delete: (id: string) => `/comment/delete/${id}`,
  },
  [ApiRouteKey.Priority]: {
    All: "/priorities",
    Many: undefined,
    Info: (id: string) => `/priority/${id}`,
    Create: "/priority/create",
    Update: (id: string) => `/priority/update/${id}`,
    Delete: (id: string) => `/priority/delete/${id}`,
  },
  [ApiRouteKey.StatusHistory]: {
    All: "/status-histories",
    Many: undefined,
    Info: (id: string) => `/status-history/${id}`,
    Create: "/status-history/create",
    Update: (id: string) => `/status-history/update/${id}`,
    Delete: (id: string) => `/status-history/delete/${id}`,
  },
  [ApiRouteKey.Status]: {
    All: "/statuses",
    Many: undefined,
    Info: (id: string) => `/status/${id}`,
    Create: "/status/create",
    Update: (id: string) => `/status/update/${id}`,
    Delete: (id: string) => `/status/delete/${id}`,
  },
  [ApiRouteKey.TagWord]: {
    All: "/tag-words",
    Many: undefined,
    Info: (id: string) => `/tag-word/${id}`,
    Create: "/tag-word/create",
    Update: (id: string) => `/tag-word/update/${id}`,
    Delete: (id: string) => `/tag-word/delete/${id}`,
  },
  [ApiRouteKey.Ticket]: {
    All: "/tickets",
    Many: `/tickets/select`,
    Info: (id: string) => `/ticket/${id}`,
    Create: "/ticket/create",
    Update: (id: string) => `/ticket/update/${id}`,
    Delete: (id: string) => `/ticket/delete/${id}`,
  },
} as const;

export const REQUEST_TIMEOUT = 5000;
