import { Entity } from '../helpers/EntityDecorator.js';
import { ExistingEntity, NewEntity } from './BaseEntity.js';
import { ObjectId } from 'mongodb';
import { Team } from './Team.js';

@Entity({ name: 'Schemas' })
export class Schema implements ExistingEntity {
  _id: ObjectId;
  teamId: ObjectId;
  type: SchemaType;
  attributes: SchemaAttribute[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    _id: ObjectId,
    teamId: ObjectId,
    type: SchemaType,
    attributes: SchemaAttribute[],
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = _id;
    this.teamId = teamId;
    this.type = type;
    this.attributes = attributes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

@Entity({ name: 'Schemas' })
export class NewSchema implements NewEntity {
  teamId: ObjectId;
  type: SchemaType;
  attributes: SchemaAttribute[];
  createdAt: Date;
  updatedAt: Date;

  constructor(team: Team, type: SchemaType, attributes: SchemaAttribute[]) {
    this.teamId = team._id;
    this.type = type;
    this.attributes = attributes;
    this.createdAt = new Date();
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
