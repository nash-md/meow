import { EventType } from '../../interfaces/EventType';
import { Amount } from './events/Amount';
import { Assign } from './events/Assign';
import { Attribute } from './events/Attribute';
import { ClosedAt } from './events/ClosedAt';
import { CreatedAt } from './events/CreatedAt';
import { Lane } from './events/Lane';
import { Name } from './events/Name';

import { Comment } from './events/Comment';
import { NextFollowUpAt } from './events/NextFollowUpAt';
import {
  AmountEvent,
  AssignEvent,
  AttributeEvent,
  CardEvent,
  ClosedAtEvent,
  CommentEvent,
  LaneEvent,
  NameEvent,
  NextFollowUpAtEvent,
} from '../../interfaces/CardEvent';

const getItem = (event: CardEvent) => {
  switch (event.type) {
    case EventType.ClosedAtChanged:
      return <ClosedAt event={event as ClosedAtEvent} />;
    case EventType.NameChanged:
      return <Name event={event as NameEvent} />;
    case EventType.NextFollowUpAtChanged:
      return <NextFollowUpAt event={event as NextFollowUpAtEvent} />;
    case EventType.CardMoved:
      return <Lane event={event as LaneEvent} />;
    case EventType.AmountChanged:
      return <Amount event={event as AmountEvent} />;
    case EventType.CommentCreated:
      return <Comment event={event as CommentEvent} />;
    case EventType.Created:
      return <CreatedAt />;
    case EventType.Assigned:
      return <Assign event={event as AssignEvent} />;
    case EventType.AttributeChanged:
      return <Attribute event={event as AttributeEvent} />;
    default:
      break;
  }
};

export interface ActivityItemProps {
  item: CardEvent;
}

export const ActivityItem = ({ item }: ActivityItemProps) => {
  return <span key={item._id}>{getItem(item)}</span>;
};
