import { Response, NextFunction } from 'express';
import { CardStatus } from '../entities/Card.js';
import { EventType } from '../entities/Event.js';
import { Lane, LaneType } from '../entities/Lane.js';
import { DatabaseHelper } from '../helpers/DatabaseHelper.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { DateTime } from 'luxon';

export const enum FilterMode {
  OwnedByMe = 'owned-by-me',
  RequireUpdate = 'require-update',
  RecentlyUpdated = 'recently-updated',
}

function parseFilterParameter(filter: string): Set<FilterMode> {
  const list = filter.split(',');

  const filters = new Set<FilterMode>();

  list.forEach((entry) => {
    if (Object.values(list).includes(entry as FilterMode)) {
      filters.add(entry as FilterMode);
    }
  });

  return filters;
}

const getActiveStatisticsByLanes = async (
  teamId: string,
  lanes: Lane[],
  filter?: Set<FilterMode>,
  userId?: string
) => {
  const direct = DatabaseHelper.get();
  const collection = direct.collection('Cards');

  const match: any = {
    $match: {
      teamId: { $eq: teamId },
      status: { $ne: CardStatus.Deleted },
      laneId: { $in: lanes.map((lane) => lane.id?.toString()) },
    },
  };

  if (filter && filter.has(FilterMode.OwnedByMe) && userId) {
    match.$match.userId = { $eq: userId.toString() };
  }

  const threeDaysAgo = DateTime.local().startOf('day').minus({ days: 3 });

  if (filter && filter.has(FilterMode.RecentlyUpdated)) {
    match.$match.updatedAt = { $gt: threeDaysAgo.toJSDate() };
  }

  if (filter && filter.has(FilterMode.RequireUpdate)) {
    match.$match.$or = [
      { nextFollowUpAt: { $lt: new Date() } },
      { closedAt: { $lt: new Date() } },
    ];
  }

  const group = {
    $group: {
      _id: '$laneId',
      count: { $sum: 1 },
      cycleTimeTotal: {
        $sum: {
          $divide: [{ $subtract: ['$closedAt', '$createdAt'] }, 1000 * 60 * 60],
        },
      },
      timeSinceCreationTotal: {
        $sum: {
          $divide: [{ $subtract: [new Date(), '$createdAt'] }, 1000 * 60 * 60],
        },
      },
      timeInLaneTotal: {
        $sum: {
          $divide: [
            { $subtract: [new Date(), '$inLaneSince'] },
            1000 * 60 * 60,
          ],
        },
      },
    },
  };

  const project = {
    $project: {
      _id: 0,
      id: '$_id',
      timeInLaneAvg: { $divide: ['$timeInLaneTotal', '$count'] },
      timeSinceCreationAvg: { $divide: ['$timeSinceCreationTotal', '$count'] },
      cycleTimeAvg: {
        $divide: ['$cycleTimeTotal', '$count'],
      },
      count: 1,
    },
  };

  const cursor = await collection.aggregate([match, group, project]);

  const statistics = await cursor.toArray();

  return statistics;
};

const getMovementStatisticsByLanes = async (
  teamId: string,
  lanes: Lane[],
  filter?: Set<FilterMode>,
  userId?: string
) => {
  const direct = DatabaseHelper.get();
  const events = direct.collection('Events');

  const match = {
    $match: {
      type: { $eq: EventType.LaneMoved },
      teamId: { $eq: teamId },
    },
  };

  const sort = {
    $sort: {
      createdAt: -1,
    },
  };

  const groupByCardId = {
    $group: {
      _id: '$entityId',
      latest: { $first: '$$ROOT' },
    },
  };

  const matchLatestLaneMove = {
    $match: {
      'latest.body.to': { $in: lanes.map((lane) => lane.id!.toString()) },
    },
  };

  const lookupCard = {
    $lookup: {
      from: 'Cards',
      let: { cardId: { $toObjectId: '$latest.entityId' } },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$_id', '$$cardId'],
            },
          },
        },
      ],
      as: 'card',
    },
  };

  const matchNotDeletedAndFound: any = {
    $match: {
      'card.status': { $ne: CardStatus.Deleted },
      card: { $ne: [] },
    },
  };

  if (filter && filter.has(FilterMode.OwnedByMe) && userId) {
    matchNotDeletedAndFound.$match['card.userId'] = { $eq: userId.toString() };
  }

  const projectLaneId = {
    $project: {
      _id: 1,
      laneId: '$latest.body.from',
      amount: '$card.amount',
    },
  };

  const unwind = {
    $unwind: '$amount',
  };

  const group = {
    $group: {
      _id: '$laneId',
      count: { $sum: 1 },
      amount: { $sum: '$amount' },
    },
  };

  const project = {
    $project: {
      _id: 0,
      id: '$_id',
      count: 1,
      amount: 1,
    },
  };

  const cursor = await events.aggregate([
    match,
    sort,
    groupByCardId,
    matchLatestLaneMove,
    lookupCard,
    matchNotDeletedAndFound,
    projectLaneId,
    unwind,
    group,
    project,
  ]);

  const statistics = await cursor.toArray();

  return statistics;
};

const get = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const teamId = req.jwt.team.id!.toString();
    const userId = req.jwt.user.id?.toString();

    const lanes = await EntityHelper.findByTeam(Lane, req.jwt.team);

    const filter = req.query.filter
      ? parseFilterParameter(req.query.filter.toString())
      : undefined;

    const active = await getActiveStatisticsByLanes(
      teamId,
      lanes.filter((lane) => lane.tags.type === LaneType.Normal),
      filter,
      userId
    );

    const won = await getMovementStatisticsByLanes(
      teamId,
      lanes.filter((lane) => lane.tags.type === LaneType.ClosedWon),
      filter,
      userId
    );

    const lost = await getMovementStatisticsByLanes(
      teamId,
      lanes.filter((lane) => lane.tags.type === LaneType.ClosedLost),
      filter,
      userId
    );

    return res.json({ active, lost, won });
  } catch (error) {
    return next(error);
  }
};

export const LaneStatisticsController = {
  get,
};
