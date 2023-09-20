import { Attribute } from './Attribute.js';

import { Entity } from '../helpers/EntityDecorator.js';
import { ExistingEntity, NewEntity } from './BaseEntity.js';
import { ObjectId } from 'mongodb';
import { User } from './User.js';
import { Lane } from './Lane.js';

@Entity({ name: 'Cards' })
export class Card implements ExistingEntity {
  _id: ObjectId;
  teamId: ObjectId;
  userId: ObjectId;
  laneId: ObjectId;
  inLaneSince: Date;
  name: string;
  amount: number;
  status: CardStatus;
  attributes?: Attribute;
  closedAt?: Date;
  nextFollowUpAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    _id: ObjectId,
    teamId: ObjectId,
    userId: ObjectId,
    laneId: ObjectId,
    name: string,
    amount: number,
    inLaneSince: Date,
    status: CardStatus,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = _id;
    this.teamId = teamId;
    this.userId = userId;
    this.laneId = laneId;
    this.name = name;
    this.amount = amount;
    this.inLaneSince = inLaneSince;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toPlain(): PlainCard {
    return {
      _id: this._id?.toString()!,
      teamId: this.teamId.toString(),
      userId: this.userId.toString(),
      laneId: this.laneId.toString(),
      inLaneSince: this.inLaneSince,
      name: this.name,
      amount: this.amount,
      status: this.status,
      attributes: this.attributes,
      createdAt: this.createdAt!,
      updatedAt: this.updatedAt!,
      closedAt: this.closedAt,
      nextFollowUpAt: this.nextFollowUpAt,
    };
  }
}

export enum CardStatus {
  Active = 'active',
  Deleted = 'deleted',
  Archived = 'archived',
}

export interface PlainCard {
  _id: string;
  teamId: string;
  userId: string;
  laneId: string;
  inLaneSince: Date;
  name: string;
  amount: number;
  status: CardStatus;
  attributes?: Attribute;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  nextFollowUpAt?: Date;
}

@Entity({ name: 'Cards' })
export class NewCard implements NewEntity {
  teamId: ObjectId;
  userId: ObjectId;
  laneId: ObjectId;
  inLaneSince: Date;
  name: string;
  amount: number;
  status: CardStatus;
  attributes?: Attribute;
  closedAt?: Date;
  nextFollowUpAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User, lane: Lane, name: string, amount: number) {
    this.teamId = user.teamId;
    this.userId = user._id!;
    this.laneId = lane._id!;
    this.name = name;
    this.amount = amount;
    this.inLaneSince = new Date();
    this.status = CardStatus.Active;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
