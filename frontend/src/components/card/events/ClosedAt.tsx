import { DateTime } from 'luxon';
import { useState } from 'react';
import { Event } from '../../../interfaces/Event';

interface ClosedAtProps {
  event: Event;
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
