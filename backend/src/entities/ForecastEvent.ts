import { EventType } from './EventType.js';
import { Entity } from '../helpers/EntityDecorator.js';
import { ExistingEntity, NewEntity } from './BaseEntity.js';
import { ObjectId } from 'mongodb';
import { Lane } from './Lane.js';
import { User } from './User.js';

@Entity({ name: 'Events' })
export class ForecastEvent implements ExistingEntity {
  _id: ObjectId;
  teamId: ObjectId;
  laneId: ObjectId;
  userId?: ObjectId;
  type: EventType;
  amount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    _id: ObjectId,
    teamId: ObjectId,
    laneId: ObjectId,
    amount: number,
    createdAt: Date,
    updatedAt: Date,
    userId?: ObjectId
  ) {
    this._id = _id;
    this.teamId = teamId;
    this.laneId = laneId;
    this.amount = amount;
    this.type = EventType.LaneAmountChanged;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    if (userId) {
      this.userId = userId;
    }
  }
}

@Entity({ name: 'Events' })
export class NewForecastEvent implements NewEntity {
  teamId: ObjectId;
  laneId: ObjectId;
  userId?: ObjectId;
  type: EventType;
  amount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(lane: Lane, amount: number, user?: User) {
    this.teamId = lane.teamId;
    this.laneId = lane._id;
    this.amount = amount;
    this.type = EventType.LaneAmountChanged;

    if (user) {
      this.userId = user._id;
    }

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
