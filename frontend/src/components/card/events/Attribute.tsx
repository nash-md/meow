import { useState } from 'react';
import { Event } from '../../../interfaces/Event';

interface AttributeProps {
  event: Event;
}

export const Attribute = ({ event }: AttributeProps) => {
  const [list] = useState(event.body);

  return (
    <div className="body">
      {Array.isArray(list) &&
        list.map((item: any, index: number) => {
          switch (item?.type) {
            case 'added':
              return (
                <span key={index}>
                  <b> {item.name}</b> was added, value is <b>{item.value}</b>.
                </span>
              );

            case 'updated':
              return (
                <span key={index}>
                  <b>{item.name}</b> was changed to <b>{item.value}</b>.
                </span>
              );

            case 'removed':
              return (
                <span key={index}>
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
