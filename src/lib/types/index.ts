
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
