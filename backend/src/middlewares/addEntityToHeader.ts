import { Response, NextFunction } from 'express';
import { Team } from '../entities/Team.js';
import { User } from '../entities/User.js';
import { InvalidHeaderError } from '../errors/InvalidHeaderError.js';
import { TeamNotFoundError } from '../errors/TeamNotFoundError.js';
import { UserNotFoundError } from '../errors/UserNotFoundError.js';

import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { database } from '../worker.js';

export const addEntityToHeader = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const { teamId, userId } = request.headers;

    if (typeof teamId !== 'string') {
      return next(new InvalidHeaderError());
    }

    const team = await database.manager.findOneById(Team, teamId);

    if (!team) {
      return next(new TeamNotFoundError());
    }

    if (typeof userId !== 'string') {
      return next(new InvalidHeaderError());
    }

    const user = await database.manager.findOneById(User, userId);

    if (!user) {
      return next(new UserNotFoundError());
    }

    request.jwt = {
      user,
      team,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};
