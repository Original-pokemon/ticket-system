import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";

type CategoryType = {
  id: number;
  description: string;
  task_performers: string[];
};

export class CategoryService extends BaseService<CategoryType> {
  constructor() {
    super(ApiRouteKey.Category);
  }
}
