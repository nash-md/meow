import { useState } from 'react';
import { Event } from '../../../interfaces/Event';

interface AttributeProps {
  event: Event;
}

export const Attribute = ({ event }: AttributeProps) => {
  const [list] = useState(event.body);

  return (
    <div>
      {Array.isArray(list) &&
        list.map((item: any) => {
          switch (item?.type) {
            case 'added':
              return (
                <span>
                  <b> {item.name}</b> was added, value is <b>{item.value}</b>.
                </span>
              );

            case 'updated':
              return (
                <span>
                  <b>{item.name}</b> was changed to <b>{item.value}</b>.
                </span>
              );

            case 'removed':
              return (
                <span>
                  <b>{item.name}</b> was removed.
                </span>
              );

            default:
              break;
          }
        })}
    </div>
  );
};
