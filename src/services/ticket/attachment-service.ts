import { AttachmentType } from "#root/types/index.js";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class AttachmentService extends BaseService<AttachmentType> {
  constructor() {
    super(ApiRouteKey.Attachment);
  }
}
