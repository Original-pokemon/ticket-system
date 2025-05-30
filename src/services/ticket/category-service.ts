import { CategoryType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class CategoryService extends BaseService<CategoryType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.Category, api);
  }
}
