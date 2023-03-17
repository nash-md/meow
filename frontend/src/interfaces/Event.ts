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
  AmountChanged = 'amount-changed',
  AttributeChanged = 'attribute-changed',
  ClosedAtChanged = 'closed-at-changed',
  NextFollowUpAtChanged = 'next-follow-up-at-changed',
  Created = 'created',
  Assigned = 'assigned',
  Deleted = 'deleted',
}
