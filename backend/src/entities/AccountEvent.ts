import { Entity } from '../helpers/EntityDecorator.js';
import { Account } from './Account.js';
import { ExistingEntity, NewEntity } from './BaseEntity.js';
import { EventType } from './EventType.js';
import { ObjectId } from 'mongodb';
import { User } from './User.js';

@Entity({ name: 'Events' })
export class AccountEvent implements ExistingEntity {
  _id: ObjectId;
  teamId: ObjectId;
  accountId: ObjectId;
  userId: ObjectId;
  type: EventType;
  body: any;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    _id: ObjectId,
    teamId: ObjectId,
    accountId: ObjectId,
    userId: ObjectId,
    type: EventType,
    body: any,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = _id;
    this.teamId = teamId;
    this.accountId = accountId;
    this.userId = userId;
    this.type = type;
    this.body = body;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

@Entity({ name: 'Events' })
export class NewAccountEvent implements NewEntity {
  teamId: ObjectId;
  userId: ObjectId;
  accountId: ObjectId;
  type: EventType;
  body: any;
  createdAt: Date;
  updatedAt: Date;

  constructor(account: Account, user: User, type: EventType, body: any = null) {
    this.teamId = account.teamId;
    this.userId = user._id;
    this.accountId = account._id;
    this.type = type;
    this.body = body;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
