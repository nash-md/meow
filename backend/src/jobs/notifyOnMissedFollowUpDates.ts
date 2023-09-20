import { DateTime } from 'luxon';
import { log } from '../worker.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { Card } from '../entities/Card.js';
import { NewCardEvent } from '../entities/CardEvent.js';
import { User } from '../entities/User.js';
import { EventType } from '../entities/EventType.js';

export const notifyOnMissedFollowUpDates = async () => {
  log.info(`run job ${notifyOnMissedFollowUpDates.name}`);

  const oneWeekAgo = DateTime.now().startOf('day').minus({ days: 7 });

  log.info(
    `${
      notifyOnMissedFollowUpDates.name
    }: find all cards with nextFollowUpAt on ${oneWeekAgo.toString()}`
  );

  const query = {
    nextFollowUpAt: { $gt: oneWeekAgo.toJSDate(), $lt: oneWeekAgo.endOf('day').toJSDate() },
  };

  const list = await EntityHelper.findBy(Card, query);

  Promise.all(
    list.map(async (card) => {
      const user = await EntityHelper.findOneByIdOrFail(User, card.userId);

      const event = new NewCardEvent(card, user, EventType.NextFollowUpAtWarning, {
        followUpTargetDate: oneWeekAgo.toJSDate(),
      });

      await EntityHelper.create(event);

      log.info(
        `stored card event ${EventType.NextFollowUpAtWarning} on card ${card._id} - ${card.name}`
      );
    })
  );

  log.info(`complete job ${notifyOnMissedFollowUpDates.name}: created ${list.length} events`);
};
