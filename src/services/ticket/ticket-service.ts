import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";

export type TicketType = {
  id?: string;
  title: string;
  description: string;
  user_id?: string;
  attachments: string[];
  petrol_station_id: string;
  ticket_category?: number;
  ticket_priority?: number;
  status_id: number;
  comments: string[];
};

export class TicketService extends BaseService<TicketType> {
  constructor() {
    super(ApiRouteKey.Ticket);
  }
}
