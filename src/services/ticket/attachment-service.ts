import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";

export type AttachmentType = {
  id: string;
  comment_id: string;
  path: string;
};

export class AttachmentService extends BaseService<AttachmentType> {
  constructor() {
    super(ApiRouteKey.Attachment);
  }
}
