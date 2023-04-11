import { DateTime } from 'luxon';
import { useState } from 'react';
import { Event } from '../../../interfaces/Event';

interface NextFollowUpAtProps {
  event: Event;
}

export const NextFollowUpAt = ({ event }: NextFollowUpAtProps) => {
  const [date] = useState(event.body.to);

  let parsed;

  if (date && typeof date === 'string') {
    parsed = DateTime.fromISO(date);
  }

  return (
    <div className="body">
      Next follow-up changed to <b>{parsed?.toFormat('dd LLL yyyy')}</b>
    </div>
  );
};
