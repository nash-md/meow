import { User } from '../entities/User.js';
import { SchemaReferenceAttribute } from '../entities/Schema.js';
import { ObjectId } from 'mongodb';
import { Account } from '../entities/Account.js';
import { EntityHelper } from './EntityHelper.js';

async function setReference(
  user: User,
  entityId: string,
  toId: string,
  referenceAttribute: SchemaReferenceAttribute
) {
  const entity = await EntityHelper.findOneById<Account>(user, Account, entityId);

  if (!entity.references || !Array.isArray(entity.references)) {
    entity.references = [];
  }

  entity.references.push({
    id: new ObjectId(toId),
    entity: referenceAttribute.entity,
    schemaAttributeKey: referenceAttribute.key,
  });

  const x = await EntityHelper.persist(Account, entity);

  console.log(x);
}

async function unsetReference(
  user: User,
  entityId: string,
  toId: string,
  referenceAttribute: SchemaReferenceAttribute
) {
  const entity = await EntityHelper.findOneById<Account>(user, Account, entityId);

  if (!entity.references || !Array.isArray(entity.references)) {
    return;
  }

  entity.references = entity.references.filter((reference) => {
    return (
      reference.schemaAttributeKey !== referenceAttribute.key ||
      (reference.schemaAttributeKey === referenceAttribute.key && reference.id.toString() !== toId)
    );
  });
  const x = await EntityHelper.persist(Account, entity);
  console.log(x);
}

export const EntityReferenceHelper = {
  setReference,
  unsetReference,
};
