import { AttachmentType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class AttachmentService extends BaseService<AttachmentType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.Attachment, api);
  }
}
