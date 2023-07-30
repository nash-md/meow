import { Entity, ObjectIdColumn, BeforeUpdate, BeforeInsert, Column, ObjectId } from 'typeorm';

@Entity({ name: 'Schemas' })
export class Schema {
  @ObjectIdColumn()
  id: ObjectId | undefined;

  @Column()
  teamId: string;

  @Column()
  type: SchemaType;

  @Column({ type: 'json' })
  attributes: SchemaAttribute[];

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(teamId: string, type: SchemaType, attributes: SchemaAttribute[]) {
    this.teamId = teamId;
    this.type = type;
    this.attributes = attributes;
  }

  @BeforeInsert()
  insertCreated() {
    this.updatedAt = new Date();
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  insertUpdated() {
    this.updatedAt = new Date();
  }
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
  relationship: 'one-to-one' | 'one-to-many' | 'many-to-one';
}

export interface SchemaSelectAttribute extends BaseSchemaAttribute {
  options: string[];
}

export type SchemaAttribute =
  | BaseSchemaAttribute
  | SchemaReferenceAttribute
  | SchemaSelectAttribute;
