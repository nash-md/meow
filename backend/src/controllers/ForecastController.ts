import { Response, NextFunction } from 'express';
import { DateTime } from 'luxon';
import QueryString from 'qs';
import { FILTER_BY_NONE } from '../Constants.js';
import { CardStatus } from '../entities/Card.js';
import { Lane, LaneType } from '../entities/Lane.js';
import { DatabaseHelper } from '../helpers/DatabaseHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { ForecastService } from '../services/ForecastService.js';
import { datasource } from '../helpers/DatabaseHelper.js';

const parseRange = (query: QueryString.ParsedQs) => {
  const end = DateTime.fromISO(`${query.end}T23:59:59Z`).toJSDate();
  const start = DateTime.fromISO(query.start as string).toJSDate();

  return { start, end };
};

const achieved = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { start, end } = parseRange(req.query);
    const userId =
      req.query.userId && req.query.userId !== FILTER_BY_NONE.key
        ? req.query.userId.toString()
        : undefined;

    const statisticService = new ForecastService(datasource);

    const forecast = await statisticService.getByLaneType(
      LaneType.ClosedWon,
      req.jwt.team.id!.toString(),
      start,
      end,
      userId
    );

    return res.json(forecast);
  } catch (error) {
    return next(error);
  }
};

const predicted = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { start, end } = parseRange(req.query);
    const userId =
      req.query.userId && req.query.userId !== FILTER_BY_NONE.key
        ? req.query.userId.toString()
        : undefined;

    const statisticService = new ForecastService(datasource);

    const forecast = await statisticService.getByLaneType(
      LaneType.Normal,
      req.jwt.team.id!.toString(),
      start,
      end,
      userId
    );

    return res.json(forecast);
  } catch (error) {
    return next(error);
  }
};

const list = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const direct = DatabaseHelper.get();
    const collection = direct.collection('Cards');

    let match: any = {};

    if (req.query.mode === 'predicted') {
      const query = {
        teamId: req.jwt.team.id!.toString(),
        tags: {
          type: LaneType.Normal,
        },
        inForecast: true,
      };

      const lanes = await datasource.getMongoRepository(Lane).find(query);

      const { start, end } = parseRange(req.query);

      match = {
        $match: {
          teamId: { $eq: req.jwt.team.id?.toString() },
          status: { $ne: CardStatus.Deleted },
          laneId: { $in: lanes.map((lane) => lane.id?.toString()) },
          closedAt: {
            $gt: start,
            $lt: end,
          },
        },
      };
    } else {
      const query = {
        teamId: req.jwt.team.id!.toString(),
        tags: {
          type: LaneType.ClosedWon,
        },
      };

      const lanes = await datasource.getMongoRepository(Lane).find(query);

      const { start, end } = parseRange(req.query);

      match = {
        $match: {
          teamId: { $eq: req.jwt.team.id?.toString() },
          status: { $ne: CardStatus.Deleted },
          laneId: { $in: lanes.map((lane) => lane.id?.toString()) },
          updatedAt: {
            $gt: start,
            $lt: end,
          },
        },
      };
    }

    if (req.query.userId && req.query.userId !== FILTER_BY_NONE.key) {
      match.$match.userId = req.query.userId;
    }

    const cursor = await collection.aggregate([match]);

    const list = await cursor.toArray();

    return res.json(list);
  } catch (error) {
    return next(error);
  }
};

export const ForecastController = {
  achieved,
  predicted,
  list,
};
