import { AxiosInstance } from "axios";
import { APIRoute } from "./const.js";

export class BaseService<T> {
  private readonly resource;

  #api: AxiosInstance;

  constructor(resource: keyof typeof APIRoute, api: AxiosInstance) {
    this.resource = APIRoute[resource];
    this.#api = api;
  }

  getAll = async (): Promise<T[]> => {
    try {
      const { data } = await this.#api.get<T[]>(this.resource.All);
      return data;
    } catch {
      throw new Error("Error getting all items");
    }
  };

  getSelect = async (ids: string[]): Promise<T[]> => {
    if (ids.length === 0) {
      return [];
    }
    const searchParameters = ids.map((id) => ["id", id]);
    const parameters = new URLSearchParams(searchParameters);
    try {
      const { data } = await this.#api.get<T[]>(this.resource.All, {
        params: parameters,
      });
      return data;
    } catch {
      throw new Error("Error getting many items");
    }
  };

  getUnique = async (id: string): Promise<T> => {
    try {
      const { data } = await this.#api.get<T>(this.resource.Info(id));
      return data;
    } catch {
      throw new Error("Error getting item");
    }
  };

  create = async (item: T): Promise<string> => {
    if (this.resource.Create) {
      try {
        const { data } = await this.#api.post<string>(
          this.resource.Create,
          item,
        );
        return data;
      } catch {
        throw new Error("Error creating item");
      }
    }
    throw new Error("this method is not implemented");
  };

  update = async (item: T & { id?: string; user_id?: string }): Promise<T> => {
    const { id, user_id: userId } = item;
    if (this.resource.Update) {
      const itemId = id || userId;

      if (itemId) {
        try {
          const { data } = await this.#api.put<T>(
            this.resource.Update(itemId),
            item,
          );
          return data;
        } catch {
          throw new Error("Error updating item");
        }
      }
      throw new Error("Missing 'id' property in the item.");
    }
    throw new Error("this method is not implemented");
  };

  delete = async (id: string) => {
    if (this.resource.Delete) {
      try {
        const data = await this.#api.delete<T>(this.resource.Delete(id));
        return data;
      } catch {
        throw new Error("Error deleting item");
      }
    }
    throw new Error("this method is not implemented");
  };
}
