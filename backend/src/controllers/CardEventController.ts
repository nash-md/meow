import { Response, NextFunction } from 'express';
import { EventType } from '../entities/EventType.js';
import { InvalidUrlError } from '../errors/InvalidUrlError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { ObjectId, Sort } from 'mongodb';
import { CardEvent, NewCardEvent } from '../entities/CardEvent.js';
import { validateAndFetchCard } from '../helpers/EntityFetchHelper.js';

const list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      throw new InvalidUrlError();
    }

    const query = {
      cardId: { $eq: new ObjectId(req.params.id) },
      teamId: { $eq: req.jwt.team._id },
      type: { $ne: EventType.ForecastCard },
    };

    const sort: Sort = {
      updatedAt: -1,
    };

    const events = await EntityHelper.findBy(CardEvent, query, sort);

    return res.json(events);
  } catch (error) {
    return next(error);
  }
};

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const card = await validateAndFetchCard(req.params.id, req.jwt.user);

    let event = await EntityHelper.create(
      new NewCardEvent(card, req.jwt.user, EventType.CommentCreated, {
        text: req.body.text,
      }),
      CardEvent
    );

    return res.status(201).json(event);
  } catch (error) {
    return next(error);
  }
};

export const CardEventController = {
  list,
  create,
};
