import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";
import { CommentType } from "./comment-service.js";

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
