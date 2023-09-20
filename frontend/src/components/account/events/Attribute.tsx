import { useState } from 'react';
import { AccountEvent } from '../../../interfaces/AccountEvent';

interface AttributeProps {
  event: AccountEvent;
}

const getValueText = (item: any) => {
  if (item.reference) {
    return <b>{item.reference.name?.toString()}</b>;
  }

  return <b>{item.value?.toString()}</b>;
};

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
                  <b> {item.attribute?.name}</b> was added, value is {getValueText(item)}.
                </span>
              );

            case 'updated':
              return (
                <span key={index}>
                  <b> {item.attribute?.name}</b> was changed to {getValueText(item)}.
                </span>
              );

            case 'removed':
              return (
                <span key={index}>
                  <b>{item.attribute?.name}</b> was removed.
                </span>
              );

            default:
              break;
          }
        })}
    </div>
  );
};
