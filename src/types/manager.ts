import type { UserType } from "./index.js";

type TicketType = {
  petrol_station: string;
  tickets: string[];
};

export type ManagerType = {
  id: string;
  bush_id?: string;
  tickets?: TicketType[];
  petrol_stations?: string[];
  user?: UserType;
};
