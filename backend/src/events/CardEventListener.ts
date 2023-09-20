import { EventType } from '../entities/EventType.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { SchemaAttributeType, SchemaType } from '../entities/Schema.js';
import { RequestParser } from '../helpers/RequestParser.js';
import { findAttributeById, getAttributeListDifference } from '../helpers/AttributeHelper.js';
import { CardEventPayload } from '../events/EventStrategy.js';
import { log } from '../worker.js';
import { Account } from '../entities/Account.js';
import { Team } from '../entities/Team.js';
import { NewCardEvent } from '../entities/CardEvent.js';
import { Card } from '../entities/Card.js';

export const CardEventListener = {
  async onCardUpdateOrCreate({ user, card, updated }: CardEventPayload) {
    log.debug(`execute onCardUpdateOrCreate for card ${card._id}`);

    let { teamId } = user;

    const schema = await EntityHelper.findSchemaByType(teamId, SchemaType.Card);
    const team = await EntityHelper.findOneById(Team, teamId);

    const entity = await EntityHelper.findOneByIdOrFail(Card, card._id);

    /* if just one plain card was provided we assume it is a new card */
    if (!updated) {
      await EntityHelper.create(new NewCardEvent(entity, user, EventType.Created));

      return;
    }

    if (updated.attributes) {
      const changes = getAttributeListDifference(card.attributes, updated.attributes);

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
        await EntityHelper.create(
          new NewCardEvent(entity, user, EventType.AttributeChanged, changes)
        );
      }
    }

    if (card.amount !== updated.amount) {
      await EntityHelper.create(
        new NewCardEvent(entity, user, EventType.AmountChanged, {
          from: card.amount,
          to: updated.amount,
        })
      );
    }

    if (updated.closedAt && !RequestParser.isEqualDates(updated.closedAt, card.closedAt)) {
      await EntityHelper.create(
        new NewCardEvent(entity, user, EventType.ClosedAtChanged, {
          from: card.closedAt,
          to: updated.closedAt,
        })
      );
    }

    if (
      updated.nextFollowUpAt &&
      !RequestParser.isEqualDates(updated.nextFollowUpAt, card.nextFollowUpAt)
    ) {
      await EntityHelper.create(
        new NewCardEvent(entity, user, EventType.NextFollowUpAtChanged, {
          from: card.nextFollowUpAt,
          to: updated.nextFollowUpAt,
        })
      );
    }

    if (updated.userId!.toString() !== card.userId.toString()) {
      await EntityHelper.create(
        new NewCardEvent(entity, user, EventType.Assigned, {
          from: card.userId,
          to: updated.userId,
        })
      );
    }

    if (card.laneId !== updated.laneId) {
      const body = {
        from: card.laneId,
        to: updated.laneId,
        inLaneSince: card.inLaneSince,
      };

      await EntityHelper.create(new NewCardEvent(entity, user, EventType.CardMoved, body));
    }

    if (card.name !== updated.name) {
      const body = {
        from: card.name,
        to: updated.name,
      };

      await EntityHelper.create(new NewCardEvent(entity, user, EventType.NameChanged, body));
    }
  },
};
