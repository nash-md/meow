import { Response, NextFunction } from 'express';
import { Team } from '../entities/Team.js';
import { User } from '../entities/User.js';
import { InvalidHeaderError } from '../errors/InvalidHeaderError.js';
import { TeamNotFoundError } from '../errors/TeamNotFoundError.js';
import { UserNotFoundError } from '../errors/UserNotFoundError.js';

import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { datasource } from '../helpers/DatabaseHelper.js';
import { ObjectId } from 'mongodb';

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

    const team = await datasource.manager.findOneById(
      Team,
      new ObjectId(teamId)
    );

    if (!team) {
      return next(new TeamNotFoundError());
    }

    if (typeof userId !== 'string') {
      return next(new InvalidHeaderError());
    }

    const user = await datasource.manager.findOneById(
      User,
      new ObjectId(userId)
    );

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
