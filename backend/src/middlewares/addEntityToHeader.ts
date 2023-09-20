import { Response, NextFunction } from 'express';
import { Team } from '../entities/Team.js';
import { User } from '../entities/User.js';
import { InvalidHeaderError } from '../errors/InvalidHeaderError.js';

import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';

export const addEntityToHeader = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const { teamId, userId } = request.headers;

    if (typeof teamId !== 'string' || typeof userId !== 'string') {
      return next(new InvalidHeaderError());
    }

    const team = await EntityHelper.findOneById(Team, teamId);
    const user = await EntityHelper.findOneById(User, userId);

    if (!team) {
      return next(new EntityNotFoundError()); // TODO add constructor
    }

    if (!user) {
      return next(new EntityNotFoundError());
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
