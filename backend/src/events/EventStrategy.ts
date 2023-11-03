import { PlainCard } from '../entities/Card.js';
import { PlainAccount } from '../entities/Account.js';
import { User } from '../entities/User.js';
import { CardEvent } from '../entities/CardEvent.js';
import { AccountEvent } from '../entities/AccountEvent.js';
import { ObjectId } from 'mongodb';

export type EventType = 'account' | 'lane' | 'board' | 'card' | 'event';

export interface CardEventPayload {
  user: User;
  latest: PlainCard;
  previous?: PlainCard;
}

export interface LaneEventPayload {
  laneId: ObjectId;
  userId?: ObjectId;
}

export interface BoardEventPayload {
  boardId: ObjectId;
  userId?: ObjectId;
}

export interface HistoryEventPayload {
  // TODO fix naming
  user: User;
  event: AccountEvent | CardEvent;
}

export interface AccountEventPayload {
  user: User;
  latest: PlainAccount;
  previous?: PlainAccount;
}

export type EventPayload =
  | CardEventPayload
  | LaneEventPayload
  | BoardEventPayload
  | AccountEventPayload
  | HistoryEventPayload;

export abstract class EventStrategy {
  abstract emit(event: EventType, payload: EventPayload): void;
  abstract register(event: EventType, listener: (payload: EventPayload) => unknown): void;
}
