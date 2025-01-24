import { PetrolStationType } from "#root/types/index.js";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class PetrolStationService extends BaseService<PetrolStationType> {
  constructor() {
    super(ApiRouteKey.PetrolStation);
  }
}
