import { EntityTarget, ObjectLiteral } from 'typeorm';
import { User } from '../entities/User.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';
import { database } from '../worker.js';
import { Account } from '../entities/Account.js';
import { CardStatus } from '../entities/Card.js';

function isValidEntityId(id: string): boolean {
  // A valid ObjectId is a 24-character hex string
  const regex = /^[0-9a-fA-F]{24}$/;

  return regex.test(id);
}

async function findOneById<Entity extends ObjectLiteral>(
  user: User,
  target: EntityTarget<Entity>,
  id: string
) {
  if (!isValidEntityId(id)) {
    throw new EntityNotFoundError();
  }

  const entity = await database.getMongoRepository(target).findOneById(id);

  if (!entity) {
    throw new EntityNotFoundError();
  }

  if (
    entity instanceof Account &&
    entity.id?.toString() === user.accountId?.toString()
  ) {
    return entity;
  }

  if (entity.accountId?.toString() === user.accountId?.toString()) {
    return entity;
  }
  throw new EntityNotFoundError();
}

async function findOneByIdOrNull<Entity extends ObjectLiteral>(
  user: User,
  target: EntityTarget<Entity>,
  id: string
) {
  try {
    const entity = await findOneById(user, target, id);
    console.log(entity);
    return entity;
  } catch (error) {
    return null;
  }
}

async function findByAccoount<Entity extends ObjectLiteral>(
  target: EntityTarget<Entity>,
  account: Account
) {
  const query = {
    accountId: { $eq: account.id!.toString() },
  };

  const list = await database.getMongoRepository(target).findBy(query);

  return list;
}

async function findCardsByAccoount<Entity extends ObjectLiteral>(
  target: EntityTarget<Entity>,
  account: Account
) {
  const query = {
    where: {
      accountId: { $eq: account.id!.toString() },
      $or: [
        { status: { $exists: false } },
        { status: { $ne: CardStatus.Deleted } },
      ],
    },
  };

  const list = await database.getMongoRepository(target).find(query);

  return list;
}

export const EntityHelper = {
  findOneById,
  findByAccoount,
  findCardsByAccoount,
  findOneByIdOrNull,
};
