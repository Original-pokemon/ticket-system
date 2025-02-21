import { PetrolStationType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class PetrolStationService extends BaseService<PetrolStationType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.PetrolStation, api);
  }
}
