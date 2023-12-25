import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";

type TagWordType = {
  id: string;
  category_id: number;
  priority_id: number;
};

export class TagWordService extends BaseService<TagWordType> {
  constructor() {
    super(ApiRouteKey.TagWord);
  }
}
