import { TagWordType } from "#root/types/index.js";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class TagWordService extends BaseService<TagWordType> {
  constructor() {
    super(ApiRouteKey.TagWord);
  }
}
