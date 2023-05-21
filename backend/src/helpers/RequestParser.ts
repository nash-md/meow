import { DateTime } from 'luxon';
import { IS_ISO_8601_DATE_REGEXP, IS_ISO_8601_REGEXP } from '../Constants.js';

function isEqualDates(
  first: Date | string | undefined,
  second: Date | string | undefined
) {
  if (!first || !second) {
    return false;
  }

  const firstDateTime =
    typeof first === 'string'
      ? DateTime.fromISO(first, { zone: 'utc' })
      : DateTime.fromJSDate(first, { zone: 'utc' });

  const secondDateTime =
    typeof second === 'string'
      ? DateTime.fromISO(second, { zone: 'utc' })
      : DateTime.fromJSDate(second, { zone: 'utc' });

  return firstDateTime.toMillis() === secondDateTime.toMillis();
}

function isValidDateTimeString(date: unknown) {
  if (typeof date !== 'string') {
    return false;
  }

  return IS_ISO_8601_REGEXP.test(date);
}

function isValidDateString(date: unknown) {
  if (typeof date !== 'string') {
    return false;
  }

  return IS_ISO_8601_DATE_REGEXP.test(date);
}

function toJsDate(date: string) {
  return DateTime.fromISO(date, { zone: 'utc' }).toJSDate();
}

export const RequestParser = {
  isEqualDates,
  isValidDateTimeString,
  isValidDateString,
  toJsDate,
};
