import { EventType } from '../entities/Event.js';
import { Event } from '../entities/Event.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { SchemaType } from '../entities/Schema.js';
import { RequestParser } from '../helpers/RequestParser.js';
import { filterAttributeList, getAttributeListDifference } from '../helpers/AttributeHelper.js';
import { CardEventPayload } from '../events/EventStrategy.js';
import { EventHelper } from '../helpers/EventHelper.js';
import { User } from '../entities/User.js';
import { log } from '../worker.js';

export const CardEventListener = {
  async onCardUpdateOrCreate({ user, card, updated }: CardEventPayload) {
    log.debug(`execute onCardUpdateOrCreate for card ${card.id}`);

    let { teamId } = user;

    const cardId = card.id!.toString();
    const userId = user.id!.toString();

    const schema = await EntityHelper.findSchemaByType(teamId, SchemaType.Card);

    /* if just one plain card was provided we assume it is a new card */
    if (!updated) {
      const event = new Event(teamId, cardId, userId, EventType.Created);

      await CardEventListener.persist(user, event);

      return;
    }

    if (updated.attributes) {
      const changes = getAttributeListDifference(card.attributes, updated.attributes);

      const list = filterAttributeList(schema, changes);

      if (list.length !== 0) {
        const event = new Event(teamId, cardId, userId, EventType.AttributeChanged, list);

        await CardEventListener.persist(user, event);
      }
    }

    if (card.amount !== updated.amount) {
      const body = {
        from: card.amount,
        to: updated.amount,
      };

      const event = new Event(teamId, cardId, userId, EventType.AmountChanged, body);

      await CardEventListener.persist(user, event);
    }

    if (updated.closedAt && !RequestParser.isEqualDates(updated.closedAt, card.closedAt)) {
      const body = {
        from: card.closedAt,
        to: updated.closedAt,
      };

      const event = new Event(teamId, cardId, userId, EventType.ClosedAtChanged, body);

      await CardEventListener.persist(user, event);
    }

    if (
      updated.nextFollowUpAt &&
      !RequestParser.isEqualDates(updated.nextFollowUpAt, card.nextFollowUpAt)
    ) {
      const body = {
        from: card.nextFollowUpAt,
        to: updated.nextFollowUpAt,
      };

      const event = new Event(teamId, cardId, userId, EventType.NextFollowUpAtChanged, body);

      await CardEventListener.persist(user, event);
    }

    if (updated.userId!.toString() !== card.userId.toString()) {
      const body = {
        from: card.userId,
        to: updated.userId,
      };

      const event = new Event(teamId, cardId, userId, EventType.Assigned, body);

      await CardEventListener.persist(user, event);
    }

    if (card.laneId !== updated.laneId) {
      const body = {
        from: card.laneId,
        to: updated.laneId,
        inLaneSince: card.inLaneSince,
      };

      const event = new Event(teamId, cardId, userId, EventType.CardMoved, body);

      await CardEventListener.persist(user, event);
    }
  },

  async persist(user: User, event: Event) {
    await EntityHelper.persist(Event, event);

    EventHelper.get().emit('event', { user: user, event });
  },
};
