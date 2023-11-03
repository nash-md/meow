import { EventType } from './EventType.js';
import { Entity } from '../helpers/EntityDecorator.js';
import { ExistingEntity, NewEntity } from './BaseEntity.js';
import { ObjectId } from 'mongodb';
import { User } from './User.js';
import { Team } from './Team.js';

@Entity({ name: 'Events' })
export class ForecastTotalEvent implements ExistingEntity {
  _id: ObjectId;
  teamId: ObjectId;
  userId?: ObjectId;
  type: EventType;
  amount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    _id: ObjectId,
    teamId: ObjectId,
    amount: number,
    createdAt: Date,
    updatedAt: Date,
    userId?: ObjectId
  ) {
    this._id = _id;
    this.teamId = teamId;
    this.amount = amount;
    this.type = EventType.ForecastTotal;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    if (userId) {
      this.userId = userId;
    }
  }
}

@Entity({ name: 'Events' })
export class NewForecastTotalEvent implements NewEntity {
  teamId: ObjectId;
  userId?: ObjectId;
  type: EventType;
  amount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(team: Team, amount: number, user?: User) {
    this.teamId = team._id;
    this.amount = amount;
    this.type = EventType.ForecastTotal;

    if (user) {
      this.userId = user._id;
    }

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
