import type { UserType } from "./index.js";

export type PetrolStationType = {
  id: string;
  bush_id?: string;
  managers?: string[];
  user?: UserType;
  tickets?: string[];
};
