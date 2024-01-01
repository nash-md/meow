import { id } from './Card';
import { EventType } from './EventType';

export type CardEventType =
  | AmountEvent
  | AssignEvent
  | AttributeEvent
  | ClosedAtEvent
  | CommentEvent
  | LaneEvent
  | NameEvent
  | NextFollowUpAtEvent;

export interface CardEvent {
  readonly _id: id;
  readonly teamId: string;
  userId: string;
  cardId: string;
  readonly type: EventType;
  readonly updatedAt: string;
  readonly createdAt: string;
}

export interface AmountEvent extends CardEvent {
  type: EventType.AmountChanged;
  body: {
    from: string;
    to: string;
  };
}

export interface AssignEvent extends CardEvent {
  type: EventType.Assigned;
  body: {
    from: string;
    to: string;
  };
}

export interface AttributeEvent extends CardEvent {
  type: EventType.AttributeChanged;
  body: Array<{
    type: 'added' | 'updated' | 'removed';
    attribute?: { name: string };
    reference?: { name: string };
    value?: any;
  }>;
}

export interface ClosedAtEvent extends CardEvent {
  type: EventType.ClosedAtChanged;
  body: {
    to: string;
  };
}

export interface CommentEvent extends CardEvent {
  type: EventType.CommentCreated;
  body: {
    text: string;
  };
}

export interface LaneEvent extends CardEvent {
  type: EventType.LaneAmountChanged;
  body: {
    from: string;
    to: string;
    inLaneSince: string;
  };
}

export interface NameEvent extends CardEvent {
  type: EventType.NameChanged;
  body: {
    from: string;
    to: string;
  };
}

export interface NextFollowUpAtEvent extends CardEvent {
  type: EventType.NextFollowUpAtChanged;
  body: {
    to: string;
  };
}

export interface NextFollowUpAtWarningEvent extends CardEvent {
  type: EventType.NextFollowUpAtWarning;
  body: {
    followUpTargetDate: string;
  };
}
