import { ObjectId } from 'mongodb';

export interface ExistingEntity {
  _id: ObjectId;
  [key: string]: any;

  createdAt: Date;
  updatedAt: Date;
}

export interface NewEntity {
  [key: string]: any;
}

export interface Collection {
  _collection: string;
}
