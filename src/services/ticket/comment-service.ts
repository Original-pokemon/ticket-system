import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export type CommentType = {
  id: string;
  ticket_id: string;
  user_id: string;
  text: string;
  created_at: Date;
};

export class CommentService extends BaseService<CommentType> {
  constructor() {
    super(ApiRouteKey.Comment);
  }
}
