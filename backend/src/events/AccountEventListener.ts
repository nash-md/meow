import { EventType } from '../entities/EventType.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AccountEventPayload } from './EventStrategy.js';
import { SchemaType } from '../entities/Schema.js';
import { findAttributeById, getAttributeListDifference } from '../helpers/AttributeHelper.js';
import { log } from '../worker.js';
import { NewAccountEvent } from '../entities/AccountEvent.js';
import { Account } from '../entities/Account.js';

export const AccountEventListener = {
  async onAccountUpdate({ user, account, updated }: AccountEventPayload) {
    log.debug(`execute onAccountUpdate for account ${account._id}`);

    const { teamId } = user;

    const entity = await EntityHelper.findOneByIdOrFail(Account, account._id);

    if (!updated) {
      await EntityHelper.create(new NewAccountEvent(entity, user, EventType.Created));

      return;
    }

    const schema = await EntityHelper.findSchemaByType(teamId, SchemaType.Account);

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
        await EntityHelper.create(
          new NewAccountEvent(entity, user, EventType.AttributeChanged, changes)
        );
      }
    }

    if (account.name !== updated.name) {
      const body = {
        from: account.name,
        to: updated.name,
      };

      await EntityHelper.create(new NewAccountEvent(entity, user, EventType.NameChanged, body));
    }
  },
};
