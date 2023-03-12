import { Response, NextFunction } from 'express';
import { DateTime } from 'luxon';
import { IS_ISO_8601_REGEXP } from '../Constants.js';
import { Card, CardAttribute, CardStatus } from '../entities/Card.js';
import { Lane, LaneType } from '../entities/Lane.js';
import { User } from '../entities/User.js';
import { InvalidCardPropertyError } from '../errors/InvalidCardPropertyError.js';
import { InvalidUrlError } from '../errors/InvalidUrlError.js';
import { LaneNotFoundError } from '../errors/LaneNotFoundError.js';
import { UserNotFoundError } from '../errors/UserNotFoundError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { CardEventService } from '../services/CardEventService.js';
import { database } from '../worker.js';

function parseCardStatus(value: unknown): CardStatus {
  switch (value) {
    case 'active':
      return CardStatus.Active;
    case 'deleted':
      return CardStatus.Deleted;
    default:
      throw new InvalidCardPropertyError(`Unsupported status value: ${value}`);
  }
}

const list = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await EntityHelper.findCardsByTeam(req.jwt.team);

    return res.json(cards);
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
    let lane: Lane | null = null;

    if (req.body.laneName) {
      const query = {
        teamId: req.jwt.team.id!.toString(),
        name: req.body.laneName,
      };

      lane = await database.manager.findOneBy(Lane, query);
    }

    if (req.body.laneId) {
      lane = await EntityHelper.findOneByIdOrNull(
        req.jwt.user,
        Lane,
        req.body.laneId
      );
    }
    if (!lane) {
      throw new LaneNotFoundError();
    }

    const card = new Card(
      req.jwt.team.id!.toString(),
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

    const cardEventService = new CardEventService(database);

    cardEventService.add(updated, req.jwt.user);

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
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

    let card = await EntityHelper.findOneById(
      req.jwt.user,
      Card,
      req.params.id
    );

    let user: User | undefined = undefined;

    if (req.body.userId) {
      try {
        user = await EntityHelper.findOneById(
          req.jwt.user,
          User,
          req.body.userId
        );
      } catch (error) {
        throw new UserNotFoundError();
      }
    }

    const cardEventService = new CardEventService(database);

    // TODO refactor, remove dependency from controller
    card = await cardEventService.update(req.body, card, req.jwt.user, user);

    card.name = req.body.name;

    if (req.body.status) {
      card.status = parseCardStatus(req.body.status);
    }

    if (req.body.laneId) {
      try {
        const lane = await EntityHelper.findOneById(
          req.jwt.user,
          Lane,
          req.body.laneId
        );

        card.laneId = lane.id!.toString();

        if (lane.tags.type !== LaneType.Normal) {
          const closedAt = DateTime.utc().startOf('day');

          card.closedAt = closedAt.toJSDate();
        }
      } catch (error) {
        throw new LaneNotFoundError();
      }
    }

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
};
