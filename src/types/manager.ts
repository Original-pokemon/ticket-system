import type { PetrolStationType, TicketType, UserType } from "./index.js";

export type ManagerType = {
  id: string;
  bush_id?: string;
  petrol_stations?:
    | (PetrolStationType & { tickets: TicketType[] }[])
    | string[];
  user?: UserType;
};
