import { PlainCard } from '../entities/Card.js';
import { PlainAccount } from '../entities/Account.js';
import { User } from '../entities/User.js';
import { Event } from '../entities/Event.js';

export type EventType = 'account' | 'lane' | 'card' | 'event';

export interface CardEventPayload {
  user: User;
  card: PlainCard;
  updated?: PlainCard;
}

export interface LaneEventPayload {
  teamId: string;
  laneId: string;
  userId: string;
}

export interface HistoryEventPayload {
  // TODO fix naming
  user: User;
  event: Event;
}

export interface AccountEventPayload {
  user: User;
  account: PlainAccount;
  updated?: PlainAccount;
}

export type EventPayload =
  | CardEventPayload
  | LaneEventPayload
  | AccountEventPayload
  | HistoryEventPayload;

export abstract class EventStrategy {
  abstract emit(event: EventType, payload: EventPayload): void;
  abstract register(event: EventType, listener: (payload: EventPayload) => unknown): void;
}
