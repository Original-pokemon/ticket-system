import { ApiService } from "./api.js";
import { APIRoute } from "./const.js";

export class BaseService<T> extends ApiService {
  private readonly resource;

  constructor(resource: keyof typeof APIRoute) {
    super();
    this.resource = APIRoute[resource];
  }

  getAll = async (): Promise<T[]> => {
    const { data } = await this.api.get<T[]>(this.resource.All);
    return data;
  };

  getUnique = async (id: string): Promise<T> => {
    const { data } = await this.api.get<T>(this.resource.Info(id));
    return data;
  };

  create = async (item: T): Promise<T> => {
    if (this.resource.Create) {
      const { data } = await this.api.post<T>(this.resource.Create, item);
      return data;
    }
    throw new Error("this method is not implemented");
  };

  update = async (item: T & { id?: string; user_id?: string }): Promise<T> => {
    const { id, user_id: userId } = item;
    if (this.resource.Update) {
      const itemId = id || userId;

      if (itemId) {
        const { data } = await this.api.put<T>(
          this.resource.Update(itemId),
          item,
        );
        return data;
      }
      throw new Error("Missing 'id' property in the item.");
    }
    throw new Error("this method is not implemented");
  };

  delete = async (id: string): Promise<T> => {
    if (this.resource.Delete) {
      const { data } = await this.api.delete<T>(this.resource.Delete(id));
      return data;
    }
    throw new Error("this method is not implemented");
  };
}