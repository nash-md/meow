import { useState, useEffect, useMemo } from 'react';
import { DateTime } from 'luxon';
import { Button, TextArea } from '@adobe/react-spectrum';
import { useSelector } from 'react-redux';
import { ApplicationStore } from '../../store/ApplicationStore';
import { selectCard, selectToken, selectUsers } from '../../store/Store';
import { Avatar } from '../Avatar';
import { AccountEvent } from '../../interfaces/AccountEvent';
import { EventType } from '../../interfaces/EventType';
import { CreatedAt } from './events/CreatedAt';
import { Name } from './events/Name';
import { Comment } from './events/Comment';
import { Attribute } from './events/Attribute';
import { getRequestClient } from '../../helpers/RequestHelper';

export interface EventsProps {
  id?: string;
}

export const Events = ({ id }: EventsProps) => {
  const token = useSelector(selectToken);

  const client = getRequestClient(token);

  const [list, setList] = useState([]);
  const [comment, setComment] = useState('');
  const [isValid, setIsValid] = useState(false);

  const card = useSelector((store: ApplicationStore) => selectCard(store, id));
  const users = useSelector(selectUsers);

  useEffect(() => {
    const execute = async () => {
      let payload = await client.getAccountEvents(id!);

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

    await client.createAccountEvent(id, comment);

    setComment('');

    let payload = await client.getAccountEvents(id);

    setList(payload);
  };

  const getTitle = (event: AccountEvent) => {
    switch (event.type) {
      case EventType.NameChanged:
        return <Name event={event} />;
      case EventType.CommentCreated:
        return <Comment event={event} />;
      case EventType.Created:
        return <CreatedAt />;
      case EventType.AttributeChanged:
        return <Attribute event={event} />;
      default:
        break;
    }
  };

  return (
    <div className="card-events">
      {card ? (
        <div className="statistics">
          <div className="tile">
            <span>Opportunity Created</span>
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
        <TextArea onChange={setComment} width="100%" height="80px"></TextArea>
        <div className="submit">
          <Button isDisabled={!isValid} variant="primary" onPress={save}>
            Save
          </Button>
        </div>
      </div>

      {list.map((event: AccountEvent, index: number) => {
        const ago = event.createdAt
          ? DateTime.fromISO(event.createdAt.toString()).toRelative()
          : null;
        const user = users.find((user) => user._id === event.userId);

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
