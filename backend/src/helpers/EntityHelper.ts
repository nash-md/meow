import 'reflect-metadata';
import { User, UserAuthentication, UserStatus } from '../entities/User.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';
import { Card, CardStatus } from '../entities/Card.js';
import { Team } from '../entities/Team.js';
import { Schema, SchemaType } from '../entities/Schema.js';
import { EventType } from '../entities/EventType.js';
import { Lane } from '../entities/Lane.js';
import { DatabaseHelper } from './DatabaseHelper.js';
import { Filter, ObjectId, Sort } from 'mongodb';
import { DateTime } from 'luxon';
import { ForecastEvent } from '../entities/ForecastEvent.js';
import { getEntityMetadata } from './EntityDecorator.js';
import { CreateEntityError } from '../errors/CreateEntityError.js';
import { ExistingEntity, NewEntity } from '../entities/BaseEntity.js';
import { CardEvent } from '../entities/CardEvent.js';
import { InvalidRequestParameterError } from '../errors/InvalidRequestParameterError.js';

type EntityConstructor<T> = new (...args: any[]) => T;

function getCollectionForEntity<T>(constructor: EntityConstructor<T> | Function) {
  const metadata = getEntityMetadata(constructor);
  return DatabaseHelper.getCollection(metadata.name);
}

function isValidEntityId(id: string): boolean {
  // A valid ObjectId is a 24-character hex string
  const regex = /^[0-9a-fA-F]{24}$/;

  return regex.test(id) && ObjectId.isValid(id);
}

function convertStringToObjectId(id: string): ObjectId {
  if (typeof id !== 'string') {
    throw new InvalidRequestParameterError('_id is not type string');
  }

  if (!isValidEntityId(id)) {
    throw new InvalidRequestParameterError('_id is not a valid ObjectId');
  }

  return new ObjectId(id);
}

function isEntityOwnedBy(entity: ExistingEntity, owner: User | Team): boolean {
  if (
    entity instanceof Team &&
    owner instanceof User &&
    entity._id!.toString() === owner.teamId.toString()
  ) {
    return true;
  }

  if (owner instanceof User && entity.teamId.toString() === owner.teamId.toString()) {
    return true;
  }

  return false;
}

async function findOneByIdOrFail<T extends ExistingEntity>(
  entityClass: new (...args: any[]) => T,
  id: ObjectId | string
): Promise<T> {
  const collection = getCollectionForEntity(entityClass);

  if (typeof id === 'string') {
    id = convertStringToObjectId(id);
  }

  const document = await collection.findOne({ _id: id });

  if (!document) {
    throw new EntityNotFoundError();
  }

  return Object.assign(new entityClass(), document);
}

async function findOneById<T extends ExistingEntity>(
  entityClass: new (...args: any[]) => T,
  id: ObjectId | string
): Promise<T | null> {
  const collection = getCollectionForEntity(entityClass);

  if (typeof id === 'string') {
    id = convertStringToObjectId(id);
  }

  const document = await collection.findOne({ _id: id });

  if (!document) {
    return null;
  }

  return Object.assign(new entityClass(), document);
}

async function findOneBy<T extends ExistingEntity>(
  entityClass: new (...args: any[]) => T,
  query: Filter<T>
): Promise<T | null> {
  const collection = getCollectionForEntity(entityClass);

  const document = await collection.findOne(query);

  if (document) {
    const entity = Object.assign(new entityClass(), document);

    return entity;
  } else {
    return null;
  }
}

async function findBy<T extends ExistingEntity>(
  entityClass: new (...args: any[]) => T,
  query: Filter<T>,
  sort?: Sort
): Promise<T[]> {
  const collection = getCollectionForEntity(entityClass);

  let cursor;

  if (sort) {
    cursor = await collection.find(query).sort(sort);
  } else {
    cursor = await collection.find(query);
  }

  const documents = await cursor.toArray();

  if (documents && documents.length > 0) {
    const entitys = documents.map((doc) => Object.assign(new entityClass(), doc));
    return entitys;
  } else {
    return [];
  }
}

async function findByTeam<T extends ExistingEntity>(
  entityClass: new (...args: any[]) => T,
  team: Team
): Promise<T[]> {
  const query: any = {
    teamId: team._id,
  };

  const sort: any = {
    name: 1,
  };

  const list = await findBy(entityClass, query, sort);

  return list;
}

async function findOneByTeam<T extends ExistingEntity>(
  entityClass: new (...args: any[]) => T,
  team: Team
) {
  const query: any = {
    teamId: { $eq: team._id! },
  };

  const list = findOneBy(entityClass, query);

  return list;
}

async function findSchemaByType(teamId: ObjectId, type: SchemaType) {
  const query = {
    teamId: { $eq: teamId },
    type: { $eq: type },
  };

  const schema = await findOneBy(Schema, query);

  return schema;
}

async function findCardsByTeam(team: Team) {
  const query = {
    teamId: { $eq: team._id! },
    $or: [{ status: { $exists: false } }, { status: { $ne: CardStatus.Deleted } }],
  };

  const list = await findBy(Card, query);

  return list;
}

async function findUserByInvite(invite: string) {
  const query = {
    invite: { $eq: invite },
    status: { $eq: UserStatus.Invited },
  };

  const user = await findOneBy(User, query);
  return user;
}

async function findCardByName(teamId: ObjectId, name: string) {
  const query = {
    name: new RegExp(name, 'i'),
    teamId: { $eq: teamId },
  };

  let user = await findOneBy(Card, query);

  return user;
}

async function findUserByName(teamId: ObjectId, name: string) {
  const query = {
    name: new RegExp(name, 'i'),
    teamId: { $eq: teamId },
  };

  let user = await findOneBy(User, query);

  return user;
}

async function findEventsByUserId(teamId: ObjectId, userId: ObjectId, start: Date, end: Date) {
  const query = {
    userId: { $eq: userId },
    teamId: { $eq: teamId },
    createdAt: {
      $gt: start,
      $lt: end,
    },
  };

  let events = await findBy(CardEvent, query);

  return events;
}

async function findUserByAuthentication(authentication: UserAuthentication) {
  const query = {
    authentication: authentication,
  };

  let user = findOneBy(User, query);

  return user;
}

async function findForecastEventByDay(
  teamId: ObjectId,
  laneId: ObjectId,
  date: Date,
  userId?: ObjectId
) {
  const d = DateTime.fromJSDate(date).toUTC();
  const startOfDay = d.startOf('day').toJSDate();
  const endOfDay = d.endOf('day').toJSDate();

  const query = {
    teamId: { $eq: teamId },
    laneId: { $eq: laneId },
    type: { $eq: EventType.LaneAmountChanged },
    ...(userId ? { userId: userId } : { userId: { $exists: false } }),
    createdAt: {
      $gt: startOfDay,
      $lt: endOfDay,
    },
  };

  let event = await findOneBy(ForecastEvent, query);

  return event;
}

async function getTotalAmountByLaneId(teamId: ObjectId, laneId: ObjectId, userId?: ObjectId) {
  const collection = DatabaseHelper.getCollection('Cards');

  const pipeline = [
    {
      $match: {
        status: { $ne: CardStatus.Deleted },
        teamId: teamId,
        laneId: laneId,
        ...(userId ? { userId: userId } : {}),
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ];

  const cursor = collection.aggregate(pipeline);

  const result = await cursor.toArray();

  return result && result[0] ? result[0].total : 0;
}

async function getLanes(teamId: ObjectId) {
  const query = {
    teamId: { $eq: teamId },
  };

  let lanes = await findBy(Lane, query);

  return lanes;
}

async function update<T extends ExistingEntity>(entity: T) {
  const collection = getCollectionForEntity(entity.constructor);

  entity.updatedAt = new Date();

  await collection.updateOne({ _id: entity._id }, { $set: entity }, { upsert: true });

  return entity;
}

async function create<T extends NewEntity>(entity: T): Promise<void>;
async function create<T extends NewEntity, U extends ExistingEntity>(
  newEntity: T,
  entity: EntityConstructor<U>
): Promise<U>;

async function create<T extends NewEntity, U extends ExistingEntity>(
  newEntity: T,
  entity?: EntityConstructor<U>
): Promise<void | U> {
  const collection = getCollectionForEntity(newEntity.constructor);

  const document = await collection.insertOne(newEntity);

  if (!document || !document.insertedId) {
    throw new CreateEntityError();
  }

  if (entity) {
    return Object.assign(new entity(), { ...newEntity, _id: document.insertedId });
  }
}

async function remove<T extends ExistingEntity>(
  entityClass: EntityConstructor<T>,
  entity: T
): Promise<boolean> {
  const collection = getCollectionForEntity(entityClass);

  const result = await collection.deleteOne({ _id: entity._id });

  return result.deletedCount === 1;
}

export const EntityHelper = {
  findOneById,
  findOneByIdOrFail,
  isEntityOwnedBy,
  findOneBy,
  findBy,
  findByTeam,
  findOneByTeam,
  findCardsByTeam,
  findSchemaByType,
  findUserByInvite,
  isValidEntityId,
  findCardByName,
  findUserByName,
  findEventsByUserId,
  findForecastEventByDay,
  getTotalAmountByLaneId,
  getLanes,
  findUserByAuthentication,
  create,
  update,
  remove,
};
