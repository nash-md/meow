import { DateTime } from 'luxon';
import { useState } from 'react';
import { CardEvent } from '../../../interfaces/CardEvent';

interface ClosedAtProps {
  event: CardEvent;
}

export const ClosedAt = ({ event }: ClosedAtProps) => {
  const [date] = useState(event.body.to);

  let parsed;

  if (date && typeof date === 'string') {
    parsed = DateTime.fromISO(date);
  }

  return (
    <div className="body">
      Changed close date to <b>{parsed?.toFormat('dd LLL yyyy')}</b>
    </div>
  );
};
