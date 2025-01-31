import { Middleware } from "grammy";
import { Context } from "#root/bot/context.js";
import { ManagerType, PetrolStationType } from "#root/types/index.js";
import { isManager } from "../filters/index.js";

const TTL_MS = 12 * 60 * 60 * 1000; //  12 hours
const TTL_MS_LITTLE = 30 * 60 * 1000;

export function dataCacheMiddleware(): Middleware<Context> {
  return async (ctx, next) => {
    const { session, services, logger } = ctx;
    const now = Date.now();
    const {
      categories,
      groups,
      statuses,
      user,
      petrolStations: petrolStationsCached,
    } = session;

    try {
      if (!categories?.data || now - categories.lastUpdate > TTL_MS) {
        const allCategories = await services.Category.getAll();
        const categoryMap = Object.fromEntries(
          allCategories.map((cat) => [cat.id, cat]),
        );
        session.categories = { data: categoryMap, lastUpdate: now };
      }

      if (!groups?.data || now - groups.lastUpdate > TTL_MS) {
        const allGroups = await services.Group.getAll();
        const groupMap = Object.fromEntries(allGroups.map((g) => [g.id, g]));
        session.groups = { data: groupMap, lastUpdate: now };
      }

      if (!statuses?.data || now - statuses.lastUpdate > TTL_MS) {
        const allStatuses = await services.Status.getAll();
        const statusMap = Object.fromEntries(allStatuses.map((s) => [s.id, s]));
        session.statuses = { data: statusMap, lastUpdate: now };
      }

      if (
        isManager(user.user_group) &&
        (!petrolStationsCached?.data ||
          now - statuses.lastUpdate > TTL_MS_LITTLE)
      ) {
        const { petrol_stations: petrolStations } =
          (await services.Manager.getUnique(user.id)) as ManagerType & {
            petrol_stations: PetrolStationType[];
          };

        if (!petrolStations) {
          return next();
        }

        const petrolStationsMap = Object.fromEntries(
          petrolStations?.map((p) => [p.id, p]),
        );

        session.petrolStations = {
          data: petrolStationsMap,
          lastUpdate: now,
        };
      }

      return next();
    } catch (error) {
      logger.error(`dataCacheMiddleware error: ${error}`);
    }
  };
}
