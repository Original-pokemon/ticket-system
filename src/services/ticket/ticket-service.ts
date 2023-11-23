import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";
import { CommentType } from "./comment-service.ts";

type TicketType = {
  id: string;
  title: string;
  author_id: string;
  ticket_category: number;
  ticket_priority: number;
  comments: CommentType[];
};

export class TicketService extends BaseService<TicketType> {
  constructor() {
    super(ApiRouteKey.Ticket);
  }
}
