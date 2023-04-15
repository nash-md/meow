import { Response, NextFunction } from 'express';
import { Card } from '../entities/Card.js';
import { Account } from '../entities/Account.js';
import { Event, EventType } from '../entities/Event.js';
import { InvalidUrlError } from '../errors/InvalidUrlError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { datasource } from '../helpers/DatabaseHelper.js';
import { InvalidRequestBodyError } from '../errors/InvalidRequestBodyError.js';

const list = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      throw new InvalidUrlError();
    }

    const query = {
      where: {
        entityId: { $eq: req.params.id },
        teamId: { $eq: req.jwt.team.id!.toString() },
      },
      order: {
        updatedAt: -1,
      },
    };

    const events = await datasource.getMongoRepository(Event).find(query);

    return res.json(events);
  } catch (error) {
    return next(error);
  }
};

const create = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      throw new InvalidUrlError();
    }

    let entity: Card | Account | undefined = undefined;

    switch (req.body.entity) {
      case 'card':
        entity = await EntityHelper.findOneById(
          req.jwt.user,
          Card,
          req.params.id
        );
        break;
      case 'account':
        entity = entity = await EntityHelper.findOneById(
          req.jwt.user,
          Account,
          req.params.id
        );
        break;
      default:
        throw new InvalidRequestBodyError();
    }

    const event = new Event(
      entity.teamId,
      entity.id!.toString(),
      req.jwt.user.id!.toString(),
      EventType.CommentCreated,
      {
        text: req.body.text,
      }
    );

    entity.updatedAt = new Date();

    await datasource.manager.save(entity);

    const updated = await datasource.manager.save(event);

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

export const EventController = {
  list,
  create,
};
