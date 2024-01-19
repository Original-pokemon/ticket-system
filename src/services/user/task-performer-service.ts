import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";

type TaskPerformerType = {
  user_id: string;
  bush_id: number;
  category_id?: number;
  ticket?: string[];
};
export class TaskPerformerService extends BaseService<TaskPerformerType> {
  constructor() {
    super(ApiRouteKey.TaskPerformer);
  }
}
