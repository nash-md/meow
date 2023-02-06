import { useState, useEffect, useContext } from 'react';
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

export interface EventsProps {
  id?: string;
}

export const Events = ({ id }: EventsProps) => {
  const { client } = useContext(RequestHelperContext);

  const [list, setList] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const execute = async () => {
      let payload = await client!.getEvents(id!);

      setList(payload);
    };

    if (client && id) {
      execute();
    }
  }, [client, id]);

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

      default:
        break;
    }
  };

  return (
    <div
      style={{
        overflow: 'auto',
        height: '100%',
        position: 'relative',
      }}
    >
      <div style={{ padding: '10px' }}>
        <TextArea onChange={setComment} width="100%" height="80px"></TextArea>
        <div style={{ marginTop: '10px' }}>
          <Button variant="primary" onPress={save}>
            Save
          </Button>
        </div>
      </div>

      {list.map((event: any, index: number) => {
        const ago = DateTime.fromISO(event.createdAt).toRelative();
        return (
          <div key={event.id} style={{ padding: '10px' }}>
            <div style={{ fontSize: '1.2em' }}>{getTitle(event)}</div> {ago}
            {index !== list.length - 1 && <TimelineSpacer />}
          </div>
        );
      })}
    </div>
  );
};
