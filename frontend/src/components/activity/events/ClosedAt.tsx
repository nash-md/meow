import { DateTime } from 'luxon';
import { useState } from 'react';
import { ClosedAtEvent } from '../../../interfaces/CardEvent';

interface ClosedAtProps {
  event: ClosedAtEvent;
}

export const ClosedAt = ({ event }: ClosedAtProps) => {
  const [date] = useState(event.body.to);

  let parsed;

  if (date && typeof date === 'string') {
    parsed = DateTime.fromISO(date);
  }

  return (
    <>
      Changed close date to <b>{parsed?.toFormat('dd LLL yyyy')}</b>
    </>
  );
};
