import { EventType } from '../entities/EventType.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { SchemaAttributeType, SchemaType } from '../entities/Schema.js';
import { RequestParser } from '../helpers/RequestParser.js';
import { findAttributeById, getAttributeListDifference } from '../helpers/AttributeHelper.js';
import { CardEventPayload } from '../events/EventStrategy.js';
import { log } from '../worker.js';
import { Account } from '../entities/Account.js';
import { CardEvent, NewCardEvent } from '../entities/CardEvent.js';
import { Card } from '../entities/Card.js';
import { User } from '../entities/User.js';
import { EventHelper } from '../helpers/EventHelper.js';

export const CardEventListener = {
  async onCardUpdateOrCreate({ user, latest, previous }: CardEventPayload) {
    log.debug(`execute onCardUpdateOrCreate for card ${latest._id}`);

    let { teamId } = user;

    const schema = await EntityHelper.findSchemaByType(teamId, SchemaType.Card);
    const entity = await EntityHelper.findOneByIdOrFail(Card, latest._id);

    /* if no previous card was provided, we assume it is a new card */
    if (!previous) {
      await CardEventListener.persist(user, new NewCardEvent(entity, user, EventType.Created));

      return;
    }

    if (previous.attributes) {
      const changes = getAttributeListDifference(latest.attributes, previous.attributes);

      /* enrich event data */
      for (const change of changes) {
        const attribute = findAttributeById(change.attribute.key, schema);

        if (!attribute) {
          continue;
        }

        change.attribute.name = attribute.name;

        if (change.value && attribute.type === SchemaAttributeType.Reference) {
          const accoount = await EntityHelper.findOneById(Account, change.value.toString());

          if (accoount) {
            change.reference = {
              name: accoount.name,
            };
          }
        }
      }

      if (changes.length !== 0) {
        await CardEventListener.persist(
          user,
          new NewCardEvent(entity, user, EventType.AttributeChanged, changes)
        );
      }
    }

    if (previous.amount !== latest.amount) {
      await CardEventListener.persist(
        user,
        new NewCardEvent(entity, user, EventType.AmountChanged, {
          from: previous.amount,
          to: latest.amount,
        })
      );
    }

    if (latest.closedAt && !RequestParser.isEqualDates(latest.closedAt, previous.closedAt)) {
      await CardEventListener.persist(
        user,
        new NewCardEvent(entity, user, EventType.ClosedAtChanged, {
          from: previous.closedAt,
          to: latest.closedAt,
        })
      );
    }

    if (
      latest.nextFollowUpAt &&
      !RequestParser.isEqualDates(latest.nextFollowUpAt, previous.nextFollowUpAt)
    ) {
      await CardEventListener.persist(
        user,
        new NewCardEvent(entity, user, EventType.NextFollowUpAtChanged, {
          from: previous.nextFollowUpAt,
          to: latest.nextFollowUpAt,
        })
      );
    }

    if (latest.userId!.toString() !== previous.userId.toString()) {
      await CardEventListener.persist(
        user,
        new NewCardEvent(entity, user, EventType.Assigned, {
          from: previous.userId,
          to: latest.userId,
        })
      );
    }

    if (previous.laneId !== latest.laneId) {
      const body = {
        from: previous.laneId,
        to: latest.laneId,
        inLaneSince: previous.inLaneSince,
      };

      await CardEventListener.persist(
        user,
        new NewCardEvent(entity, user, EventType.CardMoved, body)
      );
    }

    if (previous.name !== latest.name) {
      const body = {
        from: previous.name,
        to: latest.name,
      };

      await CardEventListener.persist(
        user,
        new NewCardEvent(entity, user, EventType.NameChanged, body)
      );
    }
  },

  async persist(user: User, event: NewCardEvent) {
    const latest = await EntityHelper.create(event, CardEvent);

    EventHelper.get().emit('event', { user: user, event: latest });
  },
};
