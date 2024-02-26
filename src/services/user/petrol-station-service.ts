import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";
import type { UserType } from "../index.js";

export type PetrolStationType = {
  user_id: string;
  bush_id?: string;
  managers?: string[];
  user?: UserType;
  tickets?: string[];
};

export class PetrolStationService extends BaseService<PetrolStationType> {
  constructor() {
    super(ApiRouteKey.PetrolStation);
  }
}
