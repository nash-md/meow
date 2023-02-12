import { Response, NextFunction } from 'express';
import { DateTime } from 'luxon';
import { FILTER_BY_NONE } from '../Constants.js';
import { Lane } from '../entities/Lane.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';
import { DatabaseHelper } from '../helpers/DatabaseHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { database } from '../worker.js';

const fetch = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const direct = DatabaseHelper.get();
    const collection = direct.collection('Cards');

    // TODO, should be part of setup
    const query = {
      accountId: req.jwt.account.id!.toString(),
      name: 'Closed Won',
    };

    const lane = await database.manager.findOneBy(Lane, query);

    if (!lane) {
      throw new EntityNotFoundError();
    }

    const end = DateTime.fromISO(`${req.query.end}T23:59:59Z`).toJSDate();
    const start = DateTime.fromISO(req.query.start as string).toJSDate();

    const match: any = {
      $match: {
        accountId: { $eq: req.jwt.account.id?.toString() },
        lane: { $eq: lane.id?.toString() },
        updatedAt: {
          $gt: start,
          $lt: end,
        },
      },
    };

    if (req.query.user && req.query.user !== FILTER_BY_NONE.key) {
      match.$match.user = req.query.user;
    }
    console.log(match);
    const group = {
      $group: {
        _id: null,
        amount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    };

    const cursor = await collection.aggregate([match, group]);

    const list = await cursor.toArray();

    const payload = list[0] ? list[0] : { amount: 0, count: 0 };

    return res.json(payload);
  } catch (error) {
    return next(error);
  }
};

export const ForecastController = {
  fetch,
};
