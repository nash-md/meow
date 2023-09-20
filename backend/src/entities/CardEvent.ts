import { Entity } from '../helpers/EntityDecorator.js';
import { ExistingEntity, NewEntity } from './BaseEntity.js';
import { Card } from './Card.js';
import { EventType } from './EventType.js';
import { ObjectId } from 'mongodb';
import { User } from './User.js';

@Entity({ name: 'Events' })
export class CardEvent implements ExistingEntity {
  _id: ObjectId;
  teamId: ObjectId;
  cardId: ObjectId;
  userId: ObjectId;
  type: EventType;
  body: any;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    _id: ObjectId,
    teamId: ObjectId,
    cardId: ObjectId,
    userId: ObjectId,
    type: EventType,
    body: any,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = _id;
    this.teamId = teamId;
    this.cardId = cardId;
    this.userId = userId;
    this.type = type;
    this.body = body;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

@Entity({ name: 'Events' })
export class NewCardEvent implements NewEntity {
  teamId: ObjectId;
  userId: ObjectId;
  cardId: ObjectId;
  type: EventType;
  body: any;
  createdAt: Date;
  updatedAt: Date; // TODO this s wrong, it is returned as a string

  constructor(card: Card, user: User, type: EventType, body: any | null = null) {
    this.teamId = card.teamId;
    this.userId = user._id;
    this.cardId = card._id;
    this.type = type;
    this.body = body;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
