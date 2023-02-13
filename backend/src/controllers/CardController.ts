import { Response, NextFunction } from 'express';
import { DateTime } from 'luxon';
import { IS_ISO_8601_REGEXP } from '../Constants.js';
import { Card } from '../entities/Card.js';
import { Event, EventType } from '../entities/Event.js';
import { Lane } from '../entities/Lane.js';
import { User } from '../entities/User.js';
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
    const query = {
      accountId: { $eq: req.jwt.account.id!.toString() },
    };

    let cards = await database.getMongoRepository(Card).findBy(query);

    return res.json(cards);
  } catch (error) {
    return next(error);
  }
};

const remove = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      throw new InvalidUrlError();
    }

    const card = await database
      .getMongoRepository(Card)
      .findOneById(req.params.id);

    if (!card || card.accountId !== req.jwt.account.id?.toString()) {
      throw new EntityNotFoundError();
    }

    const result = await database.manager.delete(Card, req.params.id);

    return res.status(200).json({ done: true, affected: result.affected });
  } catch (error) {
    return next(error);
  }
};

const create = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // try to lookup the lane by friendly name first
  const query = {
    accountId: req.jwt.account.id!.toString(),
    name: req.body.lane,
  };

  const lane = await database.manager.findOneBy(Lane, query);

  // TODO, lookup lane with id and throw if not found
  const laneId = lane ? lane.id : req.body.lane;

  const card = new Card(
    req.jwt.account.id!.toString(),
    req.jwt.user.id!.toString(),
    laneId,
    req.body.name,
    req.body.amount
  );

  if (req.body.closedAt && IS_ISO_8601_REGEXP.test(req.body.closedAt)) {
    card.closedAt = DateTime.fromISO(req.body.closedAt, {
      zone: 'utc',
    }).toJSDate();
  }

  const updated = await database.manager.save(card);

  const event = new Event(
    card.accountId,
    card.id!.toString(),
    req.jwt.user.id!?.toString(),
    EventType.CreatedAt
  );

  await database.manager.save(event);

  return res.json(updated);
};

const update = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      throw new InvalidUrlError();
    }

    const card = await database
      .getMongoRepository(Card)
      .findOneById(req.params.id);

    if (!card || card.accountId !== req.jwt.account.id?.toString()) {
      throw new EntityNotFoundError();
    }

    let user: User | null = null;

    if (req.body.user) {
      user = await database.manager.findOneById(User, req.body.user);

      if (!user || user?.accountId !== req.jwt.account.id.toString()) {
        throw new EntityNotFoundError();
      }
    }

    if (card.lane !== req.body.lane) {
      const event = new Event(
        card.accountId,
        req.params.id,
        req.jwt.user.id!?.toString(),
        EventType.Lane,
        {
          from: card.lane,
          to: req.body.lane,
        }
      );

      await database.manager.save(event);
    }

    if (card.amount !== req.body.amount) {
      const event = new Event(
        card.accountId,
        req.params.id,
        req.jwt.user.id!?.toString(),
        EventType.Amount,
        {
          from: card.amount,
          to: req.body.amount,
        }
      );

      await database.manager.save(event);
    }

    if (req.body.closedAt) {
      const date = DateTime.fromISO(req.body.closedAt, {
        zone: 'utc',
      });
      if (
        date.toMillis() !==
        DateTime.fromJSDate(card.closedAt!, { zone: 'utc' }).toMillis()
      ) {
        const event = new Event(
          card.accountId,
          req.params.id,
          req.jwt.user.id!?.toString(),
          EventType.ClosedAt,
          {
            from: card.closedAt,
            to: date.toJSDate(),
          }
        );

        await database.manager.save(event);
      }

      card.closedAt = DateTime.fromISO(req.body.closedAt, {
        zone: 'utc',
      }).toJSDate();
    }

    if (user && user.id!.toString() !== card.user.toString()) {
      const event = new Event(
        card.accountId,
        req.params.id,
        req.jwt.user.id!?.toString(),
        EventType.Assign,
        {
          from: card.user,
          to: user.id,
        }
      );

      await database.manager.save(event);

      card.user = user.id!.toString();
    }

    card.name = req.body.name;
    card.lane = req.body.lane;
    card.amount = req.body.amount;

    const updated = await database.manager.save(card);

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

export const CardController = {
  list,
  create,
  update,
  remove,
};
