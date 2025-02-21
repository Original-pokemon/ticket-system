import { TaskPerformerType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class TaskPerformerService extends BaseService<TaskPerformerType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.TaskPerformer, api);
  }
}
