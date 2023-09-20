import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { CardEvent } from '../../../interfaces/CardEvent';

interface NextFollowUpAtWarningProps {
  event: CardEvent;
}

export const NextFollowUpAtWarning = ({ event }: NextFollowUpAtWarningProps) => {
  const [days, setDays] = useState<number>(0);

  useEffect(() => {
    if (event.body.followUpTargetDate && typeof event.body.followUpTargetDate === 'string') {
      setDays(
        Math.floor(
          DateTime.fromISO(event.createdAt.toString()).diff(
            DateTime.fromISO(event.body.followUpTargetDate),
            'days'
          ).days
        )
      );
    }
  }, [event.createdAt, event.body.followUpTargetDate]);

  return (
    <div className="body">
      This opportunity was due for an update <b>{days} days</b> ago, with a follow-up date of{' '}
      {DateTime.fromISO(event.createdAt.toString()).toFormat('d LLLL')}.
    </div>
  );
};
