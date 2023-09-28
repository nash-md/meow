import { Response, NextFunction } from 'express';
import { DateTime, Interval } from 'luxon';
import QueryString from 'qs';
import { FILTER_BY_NONE } from '../Constants.js';
import { CardStatus } from '../entities/Card.js';
import { Lane, LaneType } from '../entities/Lane.js';
import { DatabaseHelper } from '../helpers/DatabaseHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { ForecastService } from '../services/ForecastService.js';
import { EventType } from '../entities/EventType.js';
import { RequestParser } from '../helpers/RequestParser.js';
import { InvalidRequestQueryParameterError } from '../errors/InvalidRequestQueryParameterError.js';
import { TimeSpanExceedsLimitError } from '../errors/TimeSpanExceedsLimitError.js';
import { InvalidTimeSpanError } from '../errors/InvalidTimeSpanError.js';
import { ObjectId } from 'mongodb';
import { EntityHelper } from '../helpers/EntityHelper.js';

const parseRange = (query: QueryString.ParsedQs) => {
  if (!RequestParser.isValidDateString(query.start)) {
    throw new InvalidRequestQueryParameterError(
      `The query parameter 'start' is not a valid ISO date. Please provide a valid ISO date string in format 'YYYY-MM-DD'.`
    );
  }

  if (!RequestParser.isValidDateString(query.end)) {
    throw new InvalidRequestQueryParameterError(
      `The query parameter 'end' is not a valid ISO date. Please provide a valid ISO date string in format 'YYYY-MM-DD'.`
    );
  }

  const end = DateTime.fromISO(`${query.end}T23:59:59Z`, { zone: 'utc' });

  if (!end.isValid) {
    throw new InvalidRequestQueryParameterError(
      `The query parameter 'end' is not a valid ISO date. Please provide a valid ISO date in format 'YYYY-MM-DD'.`
    );
  }

  const start = DateTime.fromISO(query.start as string, { zone: 'utc' });

  if (!start.isValid) {
    throw new InvalidRequestQueryParameterError(
      `The query parameter 'end' is not a valid ISO date. Please provide a valid ISO date in format 'YYYY-MM-DD'.`
    );
  }

  if (end < start) {
    throw new InvalidTimeSpanError(
      `The 'end' date cannot be earlier than the 'start' date. Please ensure that 'start' is earlier than or equal to 'end'.`
    );
  }

  const interval = Interval.fromDateTimes(start, end);

  const differenceInDays = interval.length('days');

  if (differenceInDays > 730) {
    throw new TimeSpanExceedsLimitError(
      `The time span between 'start' and 'end' dates should not exceed 730 days. Please adjust the 'start' and 'end' dates accordingly.`
    );
  }

  return { start: start.toJSDate(), end: end.toJSDate() };
};

const achieved = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { start, end } = parseRange(req.query);

    const userId = req.query.userId ? new ObjectId(req.query.userId?.toString()) : undefined;

    const statisticService = new ForecastService();

    const forecast = await statisticService.getByLaneType(
      LaneType.ClosedWon,
      req.jwt.team._id!,
      start,
      end,
      userId
    );

    return res.json(forecast);
  } catch (error) {
    return next(error);
  }
};

const predicted = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { start, end } = parseRange(req.query);

    const userId = req.query.userId ? new ObjectId(req.query.userId?.toString()) : undefined;

    const statisticService = new ForecastService();

    const forecast = await statisticService.getByLaneType(
      LaneType.Normal,
      req.jwt.team._id,
      start,
      end,
      userId
    );

    return res.json(forecast);
  } catch (error) {
    return next(error);
  }
};

const list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const direct = DatabaseHelper.get();
    const collection = direct.collection('Cards');

    let match: any = {};

    if (req.query.mode === 'predicted') {
      const query = {
        teamId: req.jwt.team._id!,
        tags: {
          type: LaneType.Normal,
        },
        inForecast: true,
      };

      const lanes = await EntityHelper.findBy(Lane, query);

      const { start, end } = parseRange(req.query);

      match = {
        $match: {
          teamId: { $eq: req.jwt.team._id },
          status: { $ne: CardStatus.Deleted },
          laneId: { $in: lanes.map((lane) => lane._id) },
          closedAt: {
            $gt: start,
            $lt: end,
          },
        },
      };
    } else {
      const query = {
        teamId: req.jwt.team._id,
        tags: {
          type: LaneType.ClosedWon,
        },
      };

      const lanes = await EntityHelper.findBy(Lane, query);

      const { start, end } = parseRange(req.query);

      match = {
        $match: {
          teamId: { $eq: req.jwt.team._id },
          status: { $ne: CardStatus.Deleted },
          laneId: { $in: lanes.map((lane) => lane._id) },
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

    const project = {
      $project: {
        _id: 0,
      },
    };

    const add = {
      $addFields: {
        id: '$_id',
      },
    };

    const cursor = await collection.aggregate([match, add, project]);

    const list = await cursor.toArray();

    return res.json(list);
  } catch (error) {
    return next(error);
  }
};

const series = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const direct = DatabaseHelper.get();
    const collection = direct.collection('Events');

    const { start, end } = parseRange(req.query);

    const initialMatch: any = {
      $match: {
        teamId: req.jwt.team._id!,
        type: { $eq: EventType.LaneAmountChanged },
        createdAt: {
          $lt: start,
        },
      },
    };

    if (req.query.userId && req.query.userId !== FILTER_BY_NONE.key) {
      initialMatch.$match.userId = new ObjectId(req.query.userId.toString());
    } else {
      initialMatch.$match.userId = { $exists: false };
    }

    const sortDescending = { $sort: { createdAt: -1 } };

    const groupByLaneId = {
      $group: {
        _id: '$laneId',
        mostRecent: { $first: '$$ROOT' },
      },
    };

    const initialProject = {
      $project: {
        _id: 0,
        laneId: '$_id',
        amount: '$mostRecent.amount',
        createdAt: 1,
      },
    };

    const initialCursor = await collection.aggregate([
      initialMatch,
      sortDescending,
      groupByLaneId,
      initialProject,
    ]);

    const initialEvents = await initialCursor.toArray();

    const match: any = {
      $match: {
        teamId: req.jwt.team._id!,
        type: { $eq: EventType.LaneAmountChanged },
        createdAt: {
          $gt: start,
          $lt: end,
        },
      },
    };

    if (req.query.userId && req.query.userId !== FILTER_BY_NONE.key) {
      match.$match.userId = new ObjectId(req.query.userId.toString());
    } else {
      match.$match.userId = { $exists: false };
    }

    const add = {
      $addFields: {
        date: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt',
          },
        },
      },
    };

    const groupByLane = {
      $group: {
        _id: {
          date: '$date',
          laneId: '$laneId',
        },
        totalAmount: {
          $sum: '$amount',
        },
      },
    };

    const groupByDate = {
      $group: {
        _id: '$_id.date',
        lanes: {
          $push: {
            laneId: '$_id.laneId',
            amount: '$totalAmount',
          },
        },
      },
    };

    const project = {
      $project: {
        _id: 0,
        date: '$_id',
        lanes: 1,
      },
    };

    const sort = { $sort: { date: 1 } };

    const cursor = await collection.aggregate([
      match,
      add,
      groupByLane,
      groupByDate,
      project,
      sort,
    ]);

    const list = await cursor.toArray();

    /* add initial values to the list if this lane had no data on the start date */
    const startAsDateString = start.toISOString().substring(0, 10);

    let first = list.find((result) => result.date === startAsDateString);

    if (!first) {
      first = {
        lanes: [],
        date: startAsDateString,
      };

      list.unshift(first);
    }

    for (let index = 0; index < initialEvents.length; index++) {
      if (!first.lanes.some((entry: any) => entry.laneId === initialEvents[index]!.laneId)) {
        first.lanes.push({ ...initialEvents[index] });
      }
    }

    return res.json(list);
  } catch (error) {
    return next(error);
  }
};

export const ForecastController = {
  achieved,
  predicted,
  list,
  series,
};
