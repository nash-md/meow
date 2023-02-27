import { Response, NextFunction } from 'express';
import { Card } from '../entities/Card.js';
import { Event, EventType } from '../entities/Event.js';
import { InvalidUrlError } from '../errors/InvalidUrlError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { database } from '../worker.js';

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
        cardId: { $eq: req.params.id },
        teamId: { $eq: req.jwt.team.id!.toString() },
      },
      order: {
        updatedAt: -1,
      },
    };

    const events = await database.getMongoRepository(Event).findBy(query);

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

    const card = await EntityHelper.findOneById(
      req.jwt.user,
      Card,
      req.params.id
    );

    const event = new Event(
      card.teamId,
      card.id!.toString(),
      req.jwt.user.id!.toString(),
      EventType.Comment,
      {
        text: req.body.text,
      }
    );

    const updated = await database.manager.save(event);

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

export const EventController = {
  list,
  create,
};
