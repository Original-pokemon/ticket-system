import { TagWordType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class TagWordService extends BaseService<TagWordType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.TagWord, api);
  }
}
