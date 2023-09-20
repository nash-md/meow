import { User } from '../entities/User.js';
import { SchemaReferenceAttribute } from '../entities/Schema.js';
import { ObjectId } from 'mongodb';
import { Account } from '../entities/Account.js';
import { EntityHelper } from './EntityHelper.js';

async function setReference(
  user: User,
  entityId: ObjectId,
  toId: ObjectId,
  referenceAttribute: SchemaReferenceAttribute
) {
  const entity = await EntityHelper.findOneByIdOrFail(Account, entityId);

  if (!entity.references || !Array.isArray(entity.references)) {
    entity.references = [];
  }

  entity.references.push({
    _id: toId,
    entity: referenceAttribute.entity,
    schemaAttributeKey: referenceAttribute.key,
  });

  await EntityHelper.update(entity);
}

async function unsetReference(
  user: User,
  entityId: ObjectId,
  toId: ObjectId,
  referenceAttribute: SchemaReferenceAttribute
) {
  const entity = await EntityHelper.findOneByIdOrFail(Account, entityId);

  if (!entity.references || !Array.isArray(entity.references)) {
    return;
  }

  entity.references = entity.references.filter((reference) => {
    return (
      reference.schemaAttributeKey !== referenceAttribute.key ||
      (reference.schemaAttributeKey === referenceAttribute.key &&
        reference._id.toString() !== toId.toString())
    );
  });

  await EntityHelper.update(entity);
}

export const EntityReferenceHelper = {
  setReference,
  unsetReference,
};
