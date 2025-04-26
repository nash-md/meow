import { DateTime } from 'luxon';
import { useState } from 'react';
import { NextFollowUpAtEvent } from '../../../interfaces/CardEvent';
import { Translations } from '../../../Translations';
import { DEFAULT_LANGUAGE } from '../../../Constants';

interface NextFollowUpAtProps {
  event: NextFollowUpAtEvent;
}

export const NextFollowUpAt = ({ event }: NextFollowUpAtProps) => {
  const [date] = useState(event.body.to);

  let parsed;

  if (date && typeof date === 'string') {
    parsed = DateTime.fromISO(date);
  }

  return (
    <>
      {Translations.NextFollowUpChangedTo[DEFAULT_LANGUAGE]} <b>{parsed?.toFormat('dd LLL yyyy')}</b>
    </>
  );
};
