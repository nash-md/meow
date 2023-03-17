import { DateTime } from 'luxon';
import { Card } from '../interfaces/Card';

function isOverDue(card: Card) {
  const today = DateTime.now().startOf('day');

  if (card.closedAt && DateTime.fromISO(card.closedAt).startOf('day') < today) {
    return true;
  }

  if (
    card.nextFollowUpAt &&
    DateTime.fromISO(card.nextFollowUpAt).startOf('day') < today
  ) {
    return true;
  }

  return false;
}

export const CardHelper = {
  isOverDue,
};
