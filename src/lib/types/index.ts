
// Base types for the application
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export interface JsonArray extends Array<JsonValue> {}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Re-export all types
export * from './user';
export * from './cardTypes';
export * from './collection';
export * from './interaction';
export * from './team';
export * from './oaklandMemory';
