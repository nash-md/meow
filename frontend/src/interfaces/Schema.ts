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

export enum SchemaAttributeType {
  Text = 'text',
  TextArea = 'textarea',
  Select = 'select',
  Reference = 'reference',
  Boolean = 'boolean',
  Email = 'email',
}

export interface SchemaAttribute {
  key: string;
  index: number;
  name: string;
  type: SchemaAttributeType;
  options?: string[] | null;
}

export interface SchemaReferenceAttribute extends SchemaAttribute {
  reference: string | null;
}

export interface SchemaSelectAttribute extends SchemaAttribute {
  options: string[];
}
