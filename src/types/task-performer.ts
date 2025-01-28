import { TicketType } from "./ticket.js";

export type TaskPerformerType = {
  id: string;
  bush_id: string;
  category_id?: string;
  tickets?: TicketType[];
};
