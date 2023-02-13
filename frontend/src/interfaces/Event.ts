import { id } from './Card';

type EventBodyType = string | number | null;

export interface Event {
  readonly id: id;
  accountId: string;
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
  ClosedAt = 'closed-at',
  CreatedAt = 'created-at',
  Assign = 'assign',
}
