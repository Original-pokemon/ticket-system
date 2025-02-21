import { CommentType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class CommentService extends BaseService<CommentType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.Comment, api);
  }
}
