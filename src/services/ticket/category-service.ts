import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

type CategoryType = {
  id: string;
  description: string;
  task_performers: string[];
};

export class CategoryService extends BaseService<CategoryType> {
  constructor() {
    super(ApiRouteKey.Category);
  }
}
