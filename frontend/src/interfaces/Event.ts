import { id } from './Card';

type EventBodyType = any; // TODO, refactor

export interface Event {
  readonly id: id;
  teamId: string;
  userId: string;
  entityId: string;
  type: EventType;
  body: Record<string, EventBodyType>;
  readonly updatedAt: Date;
  readonly createdAt: Date;
}

export enum EventType {
  CommentCreated = 'comment-created',
  LaneMoved = 'lane-moved',
  AmountUpdated = 'amount-updated',
  AttributeUpdated = 'attribute-updated',
  ClosedAtUpdated = 'closed-at-updated',
  NextFollowUp = 'next-follow-up',
  Created = 'Created',
  Assigned = 'assigned',
  Deleted = 'delted',
}
