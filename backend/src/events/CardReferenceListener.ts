import { EntityHelper } from '../helpers/EntityHelper.js';
import { SchemaType } from '../entities/Schema.js';
import { CardEventPayload } from './EventStrategy.js';
import { log } from '../worker.js';
import { SchemaHelper } from '../helpers/SchemaHelper.js';
import { EntityReferenceHelper } from '../helpers/EntityReferenceHelper.js';
import { ObjectId } from 'mongodb';

export const CardReferenceListener = {
  async onCardUpdateOrCreate({ user, latest, previous }: CardEventPayload) {
    log.debug(`execute onCardUpdateOrCreate for card ${latest._id}`);

    let { teamId } = user;

    const cardId = new ObjectId(latest._id);
    const schema = await EntityHelper.findSchemaByType(teamId, SchemaType.Card);

    const references = SchemaHelper.getSchemaReferenceAttributes(schema?.attributes);

    for (const reference of references) {
      let createdId: ObjectId | null = null;

      createdId = SchemaHelper.getCreatedReference(
        reference,
        latest?.attributes,
        previous?.attributes
      );

      if (createdId) {
        await EntityReferenceHelper.setReference(user, createdId, cardId, reference);

        log.debug(
          `add reference to ${createdId} on entity ${cardId} - reference ${reference.key} - ${reference.name}`
        );
      }

      const deletedId = SchemaHelper.getDeletedReference(
        reference,
        latest?.attributes,
        previous?.attributes
      );

      if (deletedId) {
        await EntityReferenceHelper.unsetReference(user, deletedId, cardId, reference);

        log.debug(
          `delete reference to ${deletedId} on entity ${cardId} - reference ${reference.key} - ${reference.name}`
        );
      }

      const changed = SchemaHelper.getChangedReference(
        reference,
        latest?.attributes,
        previous?.attributes
      );

      if (changed) {
        await EntityReferenceHelper.setReference(user, changed.latestId, cardId, reference);
        await EntityReferenceHelper.unsetReference(user, changed.previousId, cardId, reference);

        log.debug(
          `update reference from ${changed.previousId} to ${changed.latestId} on entity ${cardId} - reference ${reference.key} - ${reference.name}`
        );
      }
    }
  },
};
