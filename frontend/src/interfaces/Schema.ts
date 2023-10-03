export interface Schema {
  _id?: string;
  type: SchemaType;
  attributes: SchemaAttribute[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
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

export interface BaseSchemaAttribute {
  key: string;
  index: number;
  name: string;
  type: SchemaAttributeType;
}

export interface SchemaReferenceAttribute extends BaseSchemaAttribute {
  entity: SchemaType | null;
  reverseName: string;
  relationship: 'one-to-one' | 'one-to-many' | 'many-to-one';
}

export interface SchemaSelectAttribute extends BaseSchemaAttribute {
  options: string[];
}

export type SchemaAttribute =
  | BaseSchemaAttribute
  | SchemaReferenceAttribute
  | SchemaSelectAttribute;
