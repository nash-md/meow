import { Response, NextFunction } from 'express';
import { DateTime } from 'luxon';

import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { ActivityService } from '../services/ActivityService.js';

const parseDateRangeFromRequest = (req: AuthenticatedRequest, name: string): DateTime => {
  switch (req.query[name]) {
    case 'today':
      return DateTime.utc().startOf('day');

    case 'week':
      return DateTime.utc().startOf('week');

    default:
      return DateTime.utc().minus({ days: 30 }).startOf('day');
  }
};

const list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const start = parseDateRangeFromRequest(req, 'range');

  try {
    const service = new ActivityService();

    const cardEvents = await service.get(req.jwt.team._id, start.toJSDate());

    return res.json(cardEvents);
  } catch (error) {
    return next(error);
  }
};

export const ActivityController = {
  list,
};
