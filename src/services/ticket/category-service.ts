import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

type CategoryType = {
  id: number;
  description: string;
};

export class CategoryService extends BaseService<CategoryType> {
  constructor() {
    super(ApiRouteKey.Category);
  }
}
