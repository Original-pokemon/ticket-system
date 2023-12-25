import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";
import { CommentType } from "./comment-service.ts";

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
  comments?: CommentType[];
};

export class TicketService extends BaseService<TicketType> {
  constructor() {
    super(ApiRouteKey.Ticket);
  }
}
