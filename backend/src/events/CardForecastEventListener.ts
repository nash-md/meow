import { EntityHelper } from '../helpers/EntityHelper.js';
import { CardEventPayload } from '../events/EventStrategy.js';
import { log } from '../worker.js';
import { Card } from '../entities/Card.js';
import { User } from '../entities/User.js';
import { ForecastCardEvent, NewForecastCardEvent } from '../entities/ForecastCardEvent.js';
import { Lane } from '../entities/Lane.js';
import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';

const isSameDay = (event: ForecastCardEvent, date: DateTime) => {
  return DateTime.fromJSDate(event.createdAt).hasSame(date, 'day');
};

const updateCardForecast = async (card: Card, lane: Lane, user: User, difference: number) => {
  let event = await EntityHelper.findLatestForecastCardEventForLane(
    card.teamId,
    new Date(),
    lane._id,
    card._id
  );

  if (event) {
    if (isSameDay(event, DateTime.now())) {
      event.amount = event.amount + difference;

      await EntityHelper.update(event);
    } else {
      const amount = difference;

      await EntityHelper.create(new NewForecastCardEvent(lane, card, amount));
    }
  } else {
    await EntityHelper.create(new NewForecastCardEvent(lane, card, card.amount));
  }
};

export const CardForecastEventListener = {
  async onCardUpdateOrCreate({ user, latest, previous }: CardEventPayload) {
    log.debug(`execute onCardUpdateOrCreate for card ${latest._id}`);

    let { teamId } = user;

    const card = await EntityHelper.findOneByIdOrFail(Card, latest._id);
    const lane = await EntityHelper.findOneByIdOrFail(Lane, card.laneId);

    /* if no previous card was provided, we assume it is a new card */
    if (!previous) {
      await EntityHelper.create(new NewForecastCardEvent(lane, card, card.amount));

      return;
    }

    if (previous.amount !== latest.amount) {
      const difference = latest.amount - previous.amount;

      await updateCardForecast(card, lane, user, difference);
    }

    if (previous.laneId !== latest.laneId) {
      /* remove card event from the previous lane if card was moved on the same day again */
      let event = await EntityHelper.findLatestForecastCardEventForLane(
        card.teamId,
        new Date(),
        new ObjectId(previous.laneId),
        card._id
      );

      if (event && isSameDay(event, DateTime.now())) {
        await EntityHelper.remove(ForecastCardEvent, event);
      }

      let eventNewLane = await EntityHelper.findLatestForecastCardEventForLane(
        card.teamId,
        new Date(),
        new ObjectId(latest.laneId),
        card._id
      );

      /* if card was in this lane previously, store the difference only */
      if (eventNewLane) {
        await updateCardForecast(card, lane, user, card.amount - eventNewLane.amount);
      } else {
        await updateCardForecast(card, lane, user, card.amount);
      }
    }
  },
};
