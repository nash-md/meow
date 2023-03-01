import { EntityTarget, ObjectLiteral } from 'typeorm';
import { User } from '../entities/User.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';
import { database } from '../worker.js';
import { CardStatus } from '../entities/Card.js';
import { Team } from '../entities/Team.js';
import { Schema, SchemaType } from '../entities/Schema.js';

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
    entity instanceof Team &&
    entity.id?.toString() === user.teamId?.toString()
  ) {
    return entity;
  }

  if (entity.teamId?.toString() === user.teamId?.toString()) {
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

    return entity;
  } catch (error) {
    return null;
  }
}

async function findByTeam<Entity extends ObjectLiteral>(
  target: EntityTarget<Entity>,
  team: Team
) {
  const query = {
    teamId: { $eq: team.id!.toString() },
  };

  const list = await database.getMongoRepository(target).findBy(query);

  return list;
}

async function findSchemaByType(id: string, type: SchemaType) {
  const query = {
    teamId: { $eq: id!.toString() },
    type: { $eq: type },
  };

  const list = await database.getMongoRepository(Schema).findOneBy(query);

  return list;
}

async function findCardsByTeam<Entity extends ObjectLiteral>(
  target: EntityTarget<Entity>,
  team: Team
) {
  const query = {
    where: {
      teamId: { $eq: team.id!.toString() },
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
  findByTeam,
  findCardsByTeam,
  findOneByIdOrNull,
  findSchemaByType,
};
