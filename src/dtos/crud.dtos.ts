export interface ObjectIdDTO { id: string }

export type CreateDTO<T> = Omit<T, "_id">;

export type UpdateDTO<T> = T;