import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";
import type { UserType } from "../index.ts";

export type PetrolStationType = {
  user_id: string;
  bush_id?: number;
  managers?: string[];
  user?: UserType;
};

export class PetrolStationService extends BaseService<PetrolStationType> {
  constructor() {
    super(ApiRouteKey.PetrolStation);
  }
}
