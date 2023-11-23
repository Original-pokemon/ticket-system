import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";

type CategoryType = {
  id: number;
  description: string;
};

export class CategoryService extends BaseService<CategoryType> {
  constructor() {
    super(ApiRouteKey.Category);
  }
}
