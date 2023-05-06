import { DateTime, Interval } from 'luxon';

export function toRelativeDate(date: unknown) {
  if (typeof date !== 'string') {
    return '';
  }

  return DateTime.fromISO(date).toRelative();
}

export function toIntervalInDays(start: unknown, end: unknown) {
  if (typeof start !== 'string' || typeof end !== 'string') {
    return '';
  }

  return start < end
    ? `${Interval.fromDateTimes(DateTime.fromISO(start), DateTime.fromISO(end))
        .length('days')
        .toFixed(2)} days`
    : '-';
}
