import { DateTime } from 'luxon';
import { useState } from 'react';
import { ClosedAtEvent } from '../../../interfaces/CardEvent';
import { Translations } from '../../../Translations';
import { DEFAULT_LANGUAGE } from '../../../Constants';

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
      {Translations.ClosedAtLabel[DEFAULT_LANGUAGE]} <b>{parsed?.toFormat('dd LLL yyyy')}</b>
    </>
  );
};
