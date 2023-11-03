import { EventType } from './EventType.js';
import { Entity } from '../helpers/EntityDecorator.js';
import { ExistingEntity, NewEntity } from './BaseEntity.js';
import { ObjectId } from 'mongodb';
import { Lane } from './Lane.js';
import { Card } from './Card.js';

@Entity({ name: 'Events' })
export class ForecastCardEvent implements ExistingEntity {
  _id: ObjectId;
  teamId: ObjectId;
  cardId: ObjectId;
  laneId: ObjectId;
  type: EventType;
  amount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    _id: ObjectId,
    teamId: ObjectId,
    laneId: ObjectId,
    cardId: ObjectId,
    amount: number,
    createdAt: Date,
    updatedAt: Date,
    userId: ObjectId
  ) {
    this._id = _id;
    this.teamId = teamId;
    this.laneId = laneId;
    this.cardId = cardId;
    this.amount = amount;
    this.type = EventType.ForecastCard;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

@Entity({ name: 'Events' })
export class NewForecastCardEvent implements NewEntity {
  teamId: ObjectId;
  laneId: ObjectId;
  cardId: ObjectId;
  type: EventType;
  amount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(lane: Lane, card: Card, amount: number) {
    this.teamId = lane.teamId;
    this.laneId = lane._id;
    this.cardId = card._id;
    this.amount = amount;
    this.type = EventType.ForecastCard;

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
