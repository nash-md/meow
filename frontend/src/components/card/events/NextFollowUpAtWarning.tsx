import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { NextFollowUpAtWarningEvent } from '../../../interfaces/CardEvent';
import { Translations } from '../../../Translations';
import { DEFAULT_LANGUAGE } from '../../../Constants';

interface NextFollowUpAtWarningProps {
  event: NextFollowUpAtWarningEvent;
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
      {Translations.OpportunityDueForUpdate[DEFAULT_LANGUAGE]} <b>{days} {Translations.Days[DEFAULT_LANGUAGE]}</b> {Translations.DaysAgoWithFollowUpDate[DEFAULT_LANGUAGE]}{' '}
      {DateTime.fromISO(event.createdAt.toString()).toFormat('d LLLL')}.
    </div>
  );
};
