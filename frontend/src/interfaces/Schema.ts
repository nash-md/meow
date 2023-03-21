export interface Schema {
  id?: string;
  type: SchemaType;
  schema: SchemaAttribute[];
  createdAt?: string;
  updateAt?: string;
  teamId?: string;
}

export enum SchemaType {
  Card = 'card',
  Account = 'account',
}

export interface SchemaAttribute {
  key: string;
  index: number;
  name: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}
