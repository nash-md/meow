import { DateTime } from 'luxon';
import { useState } from 'react';
import { CardEvent } from '../../../interfaces/CardEvent';

interface NextFollowUpAtProps {
  event: CardEvent;
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
