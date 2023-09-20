import { DateTime } from 'luxon';
import { Card } from '../interfaces/Card';
import { FilterMode } from '../pages/HomePage';
import { FILTER_BY_NONE } from '../Constants';
import { Lane as LaneInterface } from '../interfaces/Lane';

function isOverDue(card: Card) {
  const today = DateTime.now().startOf('day');

  if (card.closedAt && DateTime.fromISO(card.closedAt).startOf('day') < today) {
    return true;
  }

  if (card.nextFollowUpAt && DateTime.fromISO(card.nextFollowUpAt).startOf('day') < today) {
    return true;
  }

  return false;
}

function filterAll(
  lanes: LaneInterface[],
  cards: Card[],
  filters: { mode: Set<FilterMode>; userId: string; text?: string }
) {
  const filtered = lanes.map((lane) => filterByLane(lane, cards, filters));

  return filtered.reduce((previous, current) => {
    return previous.concat(current);
  }, []);
}

function filterByLane(
  lane: LaneInterface,
  cards: Card[],
  filters: { mode: Set<FilterMode>; userId: string; text?: string }
) {
  console.log(cards);
  return cards
    .filter((card) => card.laneId === lane._id)
    .filter((card) => {
      const updatedAt = card.closedAt ? DateTime.fromISO(card.updatedAt) : undefined;

      if (
        filters.mode.has(FilterMode.RecentlyUpdated) &&
        updatedAt &&
        updatedAt < DateTime.now().startOf('day').minus({ days: 3 })
      ) {
        return;
      }

      if (filters.mode.has(FilterMode.RequireUpdate) && lane.tags?.type !== 'normal') {
        return;
      }

      if (filters.mode.has(FilterMode.RequireUpdate) && lane.inForecast === false) {
        return;
      }

      if (filters.mode.has(FilterMode.RequireUpdate) && !isOverDue(card)) {
        return;
      }

      if (filters.userId !== FILTER_BY_NONE.key && card.userId !== filters.userId) {
        return;
      }

      if (filters.text) {
        const regex = new RegExp(`${filters.text}`, 'i');

        if (regex.test(lane.name)) {
          return card;
        }

        if (!regex.test(card.name)) {
          return;
        }
      }

      return card;
    });
}

export const CardHelper = {
  isOverDue,
  filterByLane,
  filterAll,
};
