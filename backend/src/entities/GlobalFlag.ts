import { ObjectId } from 'mongodb';
import { Entity as CustomEntity } from '../helpers/EntityDecorator.js';
import { ExistingEntity, NewEntity } from './BaseEntity.js';

@CustomEntity({ name: 'Flags' })
export class GlobalFlag implements ExistingEntity {
  _id: ObjectId;
  name: string;
  value: string | number | boolean | null | string[] | number[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    _id: ObjectId,
    name: string,
    value: string | number | boolean | null | string[] | number[] = null,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = _id;
    this.name = name;
    this.value = value;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

@CustomEntity({ name: 'Events' })
export class NewGlobalFlag implements NewEntity {
  name: string;
  value: string | number | boolean | null | string[] | number[];
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string, value: string | number | boolean | null | string[] | number[]) {
    this.name = name;
    this.value = value;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
