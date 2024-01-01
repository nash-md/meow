import { useState, useEffect, useContext, useMemo } from 'react';
import { DateTime } from 'luxon';
import { Lane } from './events/Lane';
import { Comment } from './events/Comment';
import { Button, TextArea } from '@adobe/react-spectrum';
import { EventType } from '../../interfaces/EventType';
import { CreatedAt } from './events/CreatedAt';
import { Amount } from './events/Amount';
import { ClosedAt } from './events/ClosedAt';
import { Assign } from './events/Assign';
import { Attribute } from './events/Attribute';
import { NextFollowUpAt } from './events/NextFollowUpAt';
import { useSelector } from 'react-redux';
import { ApplicationStore } from '../../store/ApplicationStore';
import { selectCard, selectToken, selectUsers } from '../../store/Store';
import { Avatar } from '../Avatar';
import { Name } from './events/Name';
import { NextFollowUpAtWarning } from './events/NextFollowUpAtWarning';
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
  NextFollowUpAtWarningEvent,
} from '../../interfaces/CardEvent';
import { getRequestClient } from '../../helpers/RequestHelper';

export interface EventsProps {
  id?: string;
  entity: 'card' | 'account';
}

export const Events = ({ id, entity }: EventsProps) => {
  const token = useSelector(selectToken);

  const client = getRequestClient(token);

  const [list, setList] = useState([]);
  const [comment, setComment] = useState('');
  const [isValid, setIsValid] = useState(false);

  const card = useSelector((store: ApplicationStore) => selectCard(store, id));
  const users = useSelector(selectUsers);

  useEffect(() => {
    const execute = async () => {
      let payload = await client.getCardEvents(id!);

      setList(payload);
    };

    if (id) {
      execute();
    }
  }, [id]);

  useMemo(() => {
    setIsValid(comment.length > 0);
  }, [comment]);

  const save = async () => {
    if (!id) {
      return;
    }

    await client.createCardEvent(id, comment);
    setComment('');

    let payload = await client.getCardEvents(id);

    setList(payload);
  };

  const getTitle = (event: CardEvent) => {
    switch (event.type) {
      case EventType.ClosedAtChanged:
        return <ClosedAt event={event as ClosedAtEvent} />;
      case EventType.NameChanged:
        return <Name event={event as NameEvent} />;
      case EventType.NextFollowUpAtChanged:
        return <NextFollowUpAt event={event as NextFollowUpAtEvent} />;
      case EventType.NextFollowUpAtWarning:
        return <NextFollowUpAtWarning event={event as NextFollowUpAtWarningEvent} />;
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

  return (
    <div className="card-events">
      {card ? (
        <div className="statistics">
          <div className="tile">
            <span>Opportunity Age</span>
            <h4>{DateTime.fromISO(card.createdAt!).toRelative()}</h4>
          </div>
          <div className="tile">
            <span>In Stage Since</span>
            <h4>{DateTime.fromISO(card.inLaneSince!).toRelative()}</h4>
          </div>
          <div className="tile">
            <span>Last Update</span>
            <h4>{DateTime.fromISO(card.updatedAt).toRelative()}</h4>
          </div>
        </div>
      ) : null}

      <div className="comment-form">
        <TextArea value={comment} onChange={setComment} width="100%" height="80px"></TextArea>
        <div className="submit">
          <Button isDisabled={!isValid} variant="primary" onPress={save}>
            Save
          </Button>
        </div>
      </div>

      {list.map((event: CardEvent, index: number) => {
        const ago = DateTime.fromISO(event.createdAt.toString()).toRelative();
        const user = users.find((user) => user._id === event.userId);

        if (event.type === EventType.NextFollowUpAtWarning) {
          return <div className="next-follow-up-warning">{getTitle(event)}</div>;
        }

        return (
          <div key={event._id} className="event-item">
            <div className="headline">
              <div>
                <Avatar id={user?._id} width={30} />
                <div className="name">{user?.name}</div>
              </div>

              <div className="date">{ago}</div>
            </div>

            {getTitle(event)}
          </div>
        );
      })}
    </div>
  );
};
