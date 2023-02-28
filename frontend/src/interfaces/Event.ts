import { id } from './Card';

type EventBodyType = any; // TODO, refactor

export interface Event {
  readonly id: id;
  teamId: string;
  userId: string;
  type: EventType;
  body: Record<string, EventBodyType>;
  readonly updatedAt: Date;
  readonly createdAt: Date;
}

export enum EventType {
  Comment = 'comment',
  Lane = 'lane',
  Amount = 'amount',
  Attribute = 'attribute',
  ClosedAt = 'closed-at',
  CreatedAt = 'created-at',
  Assign = 'assign',
}
