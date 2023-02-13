import { useState, useEffect, useContext, useMemo } from 'react';
import { TimelineSpacer } from './TimeLineSpacer';
import { DateTime } from 'luxon';
import { Lane } from './events/Lane';
import { Comment } from './events/Comment';
import { Button, TextArea } from '@adobe/react-spectrum';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { Event, EventType } from '../../interfaces/Event';
import { CreatedAt } from './events/CreatedAt';
import { Amount } from './events/Amount';
import { ClosedAt } from './events/ClosedAt';
import { Assign } from './events/Assign';

export interface EventsProps {
  id?: string;
}

export const Events = ({ id }: EventsProps) => {
  const { client } = useContext(RequestHelperContext);

  const [list, setList] = useState([]);
  const [comment, setComment] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const execute = async () => {
      let payload = await client!.getEvents(id!);

      setList(payload);
    };

    if (client && id) {
      execute();
    }
  }, [client, id]);

  useMemo(() => {
    setIsValid(comment.length > 0);
  }, [comment]);

  const save = async () => {
    if (!id) {
      return;
    }

    await client!.createComment(id, comment);

    setComment('');

    let payload = await client!.getEvents(id);

    setList(payload);
  };

  const getTitle = (event: Event) => {
    switch (event.type) {
      case EventType.ClosedAt:
        return <ClosedAt event={event} />;
      case EventType.Lane:
        return <Lane event={event} />;
      case EventType.Amount:
        return <Amount event={event} />;
      case EventType.Comment:
        return <Comment event={event} />;
      case EventType.CreatedAt:
        return <CreatedAt />;
      case EventType.Assign:
        return <Assign event={event} />;
      default:
        break;
    }
  };

  return (
    <div className="card-events">
      <div style={{ padding: '10px' }}>
        <TextArea onChange={setComment} width="100%" height="80px"></TextArea>
        <div style={{ marginTop: '10px' }}>
          <Button isDisabled={!isValid} variant="primary" onPress={save}>
            Save
          </Button>
        </div>
      </div>

      {list.map((event: any, index: number) => {
        const ago = DateTime.fromISO(event.createdAt).toRelative();
        return (
          <div key={event.id} className="item">
            <div>{getTitle(event)}</div>
            <span className="date">{ago}</span>
            {index !== list.length - 1 && <TimelineSpacer />}
          </div>
        );
      })}
    </div>
  );
};
