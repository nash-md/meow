import { id } from './Card';
import { EventType } from './EventType';

type EventBodyType = any; // TODO, refactor

export interface AccountEvent {
  readonly _id: id;
  readonly teamId: string;
  userId: string;
  accountId: string;
  readonly type: EventType;
  body: Record<string, EventBodyType>;
  readonly updatedAt: Date;
  readonly createdAt: Date;
}
