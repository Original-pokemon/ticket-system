import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

type TagWordType = {
  id: string;
  category_id: string;
  priority_id: string;
};

export class TagWordService extends BaseService<TagWordType> {
  constructor() {
    super(ApiRouteKey.TagWord);
  }
}
