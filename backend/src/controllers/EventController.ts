import { Response, NextFunction } from 'express';
import { Card } from '../entities/Card.js';
import { Event, EventType } from '../entities/Event.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';
import { InvalidUrlError } from '../errors/InvalidUrlError.js';
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
        accountId: { $eq: req.jwt.account.id!.toString() },
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

    let card = await database
      .getMongoRepository(Card)
      .findOneById(req.params.id);

    if (!card || card.accountId !== req.jwt.account.id?.toString()) {
      throw new EntityNotFoundError();
    }

    const event = new Event(
      card.accountId,
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
