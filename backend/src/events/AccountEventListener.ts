import { EventType } from '../entities/Event.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AccountEventPayload } from './EventStrategy.js';
import { Event } from '../entities/Event.js';
import { SchemaType } from '../entities/Schema.js';
import { findAttributeById, getAttributeListDifference } from '../helpers/AttributeHelper.js';
import { User } from '../entities/User.js';
import { EventHelper } from '../helpers/EventHelper.js';
import { log } from '../worker.js';

export const AccountEventListener = {
  async onAccountUpdate({ user, account, updated }: AccountEventPayload) {
    log.debug(`execute onAccountUpdate for account ${account.id}`);

    const userId = user.id!.toString();

    const { teamId } = user;

    if (!updated) {
      const event = new Event(teamId, account.id.toString(), userId, EventType.Created);

      await AccountEventListener.persist(user, event);

      return;
    }

    const schema = await EntityHelper.findSchemaByType(account.teamId, SchemaType.Account);

    if (updated.attributes) {
      const changes = getAttributeListDifference(account.attributes, updated.attributes);
      /* enrich event data */
      for (const key in changes) {
        const change = changes[key]!;

        const attribute = findAttributeById(change.attribute.key, schema);

        if (!attribute) {
          continue;
        }

        change.attribute.name = attribute.name;
      }

      if (changes.length !== 0) {
        const event = new Event(
          teamId,
          account.id.toString(),
          userId,
          EventType.AttributeChanged,
          changes
        );

        await AccountEventListener.persist(user, event);
      }
    }

    if (account.name !== updated.name) {
      const body = {
        from: account.name,
        to: updated.name,
      };

      const event = new Event(teamId, account.id.toString(), userId, EventType.NameChanged, body);

      await AccountEventListener.persist(user, event);
    }
  },

  async persist(user: User, event: Event) {
    await EntityHelper.persist(Event, event);

    EventHelper.get().emit('event', { user: user, event });
  },
};
