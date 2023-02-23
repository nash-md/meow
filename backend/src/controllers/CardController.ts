import { Response, NextFunction } from 'express';
import { DateTime } from 'luxon';
import { IS_ISO_8601_REGEXP } from '../Constants.js';
import { Card, CardAttribute } from '../entities/Card.js';
import { Event, EventType } from '../entities/Event.js';
import { Lane } from '../entities/Lane.js';
import { User } from '../entities/User.js';
import { InvalidUrlError } from '../errors/InvalidUrlError.js';
import { LaneNotFoundError } from '../errors/LaneNotFoundError.js';
import { UserNotFoundError } from '../errors/UserNotFoundError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { database } from '../worker.js';

function hasAttributeDifference(
  existing: CardAttribute | undefined,
  updated: CardAttribute | undefined
): boolean {
  if (!existing && !updated) {
    return false;
  }

  if (!existing || !updated) {
    return true;
  }

  const existingKeys = Object.keys(existing);
  const updatedKeys = Object.keys(updated);

  if (existingKeys.length !== updatedKeys.length) {
    return true;
  }

  for (const key in existing) {
    if (updated[key] !== existing[key]) {
      return true;
    }
  }

  return false;
}

const list = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await EntityHelper.findByAccoount(Card, req.jwt.account);

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

    await EntityHelper.findOneById(req.jwt.user, Card, req.params.id);

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

  let lane = await database.manager.findOneBy(Lane, query);

  if (!lane) {
    lane = await EntityHelper.findOneById(req.jwt.user, Lane, req.body.lane);
  }

  if (!lane) {
    throw new LaneNotFoundError();
  }

  const card = new Card(
    req.jwt.account.id!.toString(),
    req.jwt.user.id!.toString(),
    lane.id!.toString(),
    req.body.name,
    req.body.amount
  );

  if (req.body.attributes) {
    card.attributes = req.body.attributes;
  }

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

const get = async (
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

    return res.json(card);
  } catch (error) {
    return next(error);
  }
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

    const card = await EntityHelper.findOneById(
      req.jwt.user,
      Card,
      req.params.id
    );

    let user: User | null = null;

    if (req.body.user) {
      try {
        user = await EntityHelper.findOneById(
          req.jwt.user,
          User,
          req.body.user
        );
      } catch (error) {
        throw new UserNotFoundError();
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

    if (hasAttributeDifference(card.attributes, req.body.attributes)) {
      const event = new Event(
        card.accountId,
        req.params.id,
        req.jwt.user.id!?.toString(),
        EventType.Attribute,
        {}
      ); // TODO, store attribute change

      await database.manager.save(event);
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
    card.attributes = req.body.attributes;

    const updated = await database.manager.save(card);

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

export const CardController = {
  list,
  get,
  create,
  update,
  remove,
};
