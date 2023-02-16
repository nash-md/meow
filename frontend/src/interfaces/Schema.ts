export interface Schema {
  // TODO sync interfaces with be entities types
  id: string;
  type: string;
  schema: SchemaAttribute[];
}

export interface SchemaAttribute {
  key: string;
  index: number;
  name: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}
