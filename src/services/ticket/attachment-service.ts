import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export type AttachmentType = {
  id: string;
  ticket_id?: string;
  comment_id?: string;
  path: string;
};

export class AttachmentService extends BaseService<AttachmentType> {
  constructor() {
    super(ApiRouteKey.Attachment);
  }
}
