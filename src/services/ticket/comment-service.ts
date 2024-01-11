import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";

export type CommentType = {
  id?: string;
  ticket_id: string;
  user_id: string;
  text: string;
  created_at?: Date;
  attachments: string[];
};

export class CommentService extends BaseService<CommentType> {
  constructor() {
    super(ApiRouteKey.Comment);
  }
}
