import { EntityHelper } from '../helpers/EntityHelper.js';
import { SchemaReferenceAttribute, SchemaType } from '../entities/Schema.js';
import { CardEventPayload } from './EventStrategy.js';
import { log } from '../worker.js';
import { SchemaHelper } from '../helpers/SchemaHelper.js';
import { EntityReferenceHelper } from '../helpers/EntityReferenceHelper.js';
import { ObjectId } from 'mongodb';

export const CardReferenceListener = {
  async onCardUpdateOrCreate({ user, card, updated }: CardEventPayload) {
    log.debug(`execute onCardUpdateOrCreate for card ${card._id}`);

    let { teamId } = user;

    const cardId = new ObjectId(card._id);

    const schema = await EntityHelper.findSchemaByType(teamId, SchemaType.Card);

    const references = SchemaHelper.getSchemaReferenceAttributes(schema?.attributes);

    const promises = references.map(async (reference: SchemaReferenceAttribute) => {
      const createdId = SchemaHelper.getCreatedReference(
        reference,
        updated?.attributes,
        card.attributes
      );

      if (createdId) {
        await EntityReferenceHelper.setReference(user, createdId, cardId, reference);

        log.debug(
          `add reference to ${createdId} on entity ${cardId} - reference ${reference.key} - ${reference.name}`
        );
      }

      const deletedId = SchemaHelper.getDeletedReference(
        reference,
        updated?.attributes,
        card.attributes
      );

      if (deletedId) {
        await EntityReferenceHelper.unsetReference(user, deletedId, cardId, reference);

        log.debug(
          `delete reference to ${deletedId} on entity ${cardId} - reference ${reference.key} - ${reference.name}`
        );
      }

      const changed = SchemaHelper.getChangedReference(
        reference,
        updated?.attributes,
        card.attributes
      );

      if (changed) {
        await EntityReferenceHelper.setReference(user, changed.updatedId, cardId, reference);
        await EntityReferenceHelper.unsetReference(user, changed.originalId, cardId, reference);

        log.debug(
          `update reference from ${changed.originalId} to ${changed.updatedId} on entity ${cardId} - reference ${reference.key} - ${reference.name}`
        );
      }
    });

    await Promise.all(promises);
  },
};
