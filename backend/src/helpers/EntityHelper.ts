import { EntityTarget, ObjectLiteral } from 'typeorm';
import { User, UserStatus } from '../entities/User.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';
import { Card, CardStatus } from '../entities/Card.js';
import { Team } from '../entities/Team.js';
import { Schema, SchemaType } from '../entities/Schema.js';
import { Event, EventType } from '../entities/Event.js';
import { Lane } from '../entities/Lane.js';
import { DatabaseHelper, datasource } from './DatabaseHelper.js';
import { ObjectId } from 'mongodb';
import { DateTime } from 'luxon';
import { Flag } from '../entities/Flag.js';
import { Flow } from '../entities/flows/Flow.js';

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

  const entity = await datasource.manager.findOneById(target, new ObjectId(id));

  if (!entity) {
    throw new EntityNotFoundError();
  }

  if (entity instanceof Team && entity.id?.toString() === user.teamId?.toString()) {
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

async function findByTeam<Entity extends ObjectLiteral>(target: EntityTarget<Entity>, team: Team) {
  const query: any = {
    teamId: { $eq: team.id!.toString() },
  };

  const list = await datasource.manager.getMongoRepository(target).find(query);

  return list;
}

async function findOneByTeam<Entity extends ObjectLiteral>(
  target: EntityTarget<Entity>,
  team: Team
) {
  const query: any = {
    teamId: { $eq: team.id!.toString() },
  };

  const list = await datasource.manager.getMongoRepository(target).findOne(query);

  return list;
}

async function findSchemaByType(id: string, type: SchemaType) {
  const query = {
    teamId: { $eq: id!.toString() },
    type: { $eq: type },
  };

  const list = await datasource.getMongoRepository(Schema).findOneBy(query);

  return list;
}

async function findCardsByTeam(team: Team) {
  const query = {
    where: {
      teamId: { $eq: team.id!.toString() },
      $or: [{ status: { $exists: false } }, { status: { $ne: CardStatus.Deleted } }],
    },
  };

  const list = await datasource.manager.getMongoRepository(Card).find(query);

  return list;
}

async function findUserByInvite(invite: string) {
  const query = {
    where: {
      invite: { $eq: invite },
      status: { $eq: UserStatus.Invited },
    },
  };

  const user = await datasource.manager.getMongoRepository(User).findOne(query);

  return user;
}

async function findCardByName(teamId: string, name: string) {
  const query = {
    name: new RegExp(name, 'i'),
    teamId: { $eq: teamId },
  };

  let user = await datasource.manager.getMongoRepository(Card).findOneBy(query);

  return user;
}

async function findFlagByName(teamId: string, name: string) {
  const query = {
    name: { $eq: name },
    teamId: { $eq: teamId },
  };

  let flag = await datasource.manager.getMongoRepository(Flag).findOneBy(query);

  return flag;
}

async function findOrCreateFlagByName(teamId: string, name: string) {
  const query = {
    name: { $eq: name },
    teamId: { $eq: teamId },
  };

  let flag = await datasource.manager.getMongoRepository(Flag).findOneBy(query);

  return flag ? flag : new Flag(teamId, name);
}

async function findUserByName(teamId: string, name: string) {
  const query = {
    name: new RegExp(name, 'i'),
    teamId: { $eq: teamId },
  };

  let user = await datasource.manager.getMongoRepository(User).findOneBy(query);

  return user;
}

async function findFlowByEvent(teamId: string, type: EventType, value: string) {
  const query = {
    teamId: { $eq: teamId },
    trigger: { $eq: type },
    value: { $eq: value },
  };

  let flow = await datasource.getMongoRepository(Flow).findOneBy(query);

  return flow;
}

async function findEventsByUserId(teamId: string, userId: string, start: Date, end: Date) {
  const query = {
    userId: { $eq: userId },
    teamId: { $eq: teamId },
    createdAt: {
      $gt: start,
      $lt: end,
    },
  };

  let events = await datasource.getMongoRepository(Event).find(query);

  return events;
}

async function findEventByTypeAndDay(teamId: string, laneId: string, type: EventType, date: Date) {
  const d = DateTime.fromJSDate(date).toUTC();
  const startOfDay = d.startOf('day').toJSDate();
  const endOfDay = d.endOf('day').toJSDate();

  const query = {
    teamId: { $eq: teamId },
    entityId: { $eq: laneId },
    type: { $eq: type },
    createdAt: {
      $gt: startOfDay,
      $lt: endOfDay,
    },
  };

  let event = await datasource.getMongoRepository(Event).findOneBy(query);

  return event;
}

async function getTotalAmountByLaneId(teamId: string, laneId: string) {
  const direct = DatabaseHelper.get();
  const collection = direct.collection('Cards');

  const pipeline = [
    {
      $match: {
        status: { $ne: CardStatus.Deleted },
        teamId: teamId,
        laneId: laneId,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ];

  const cursor = await collection.aggregate(pipeline);

  const result = await cursor.toArray();

  return result && result[0] ? result[0].total : 0;
}

async function getLanes(teamId: string) {
  const query = {
    teamId: { $eq: teamId },
  };

  let lanes = await datasource.getMongoRepository(Lane).find(query);

  return lanes;
}

async function persist<Entity extends ObjectLiteral>(target: EntityTarget<Entity>, entity: Entity) {
  const updated = await datasource.manager.getMongoRepository(target).save(entity);

  return updated;
}

export const EntityHelper = {
  findOneById,
  findByTeam,
  findOneByTeam,
  findCardsByTeam,
  findOneByIdOrNull,
  findSchemaByType,
  findUserByInvite,
  isValidEntityId,
  findCardByName,
  findUserByName,
  findFlowByEvent,
  findEventsByUserId,
  findEventByTypeAndDay,
  getTotalAmountByLaneId,
  getLanes,
  findFlagByName,
  findOrCreateFlagByName,
  persist,
};
