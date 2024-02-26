import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";
import { AttachmentType } from "./attachment-service.js";

export type CommentType = {
  id?: string;
  ticket_id: string;
  user_id: string;
  text: string;
  created_at?: Date;
  attachments: AttachmentType[] | string[];
};

export class CommentService extends BaseService<CommentType> {
  constructor() {
    super(ApiRouteKey.Comment);
  }
}
