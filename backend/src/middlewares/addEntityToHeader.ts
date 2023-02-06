import { Response, NextFunction } from 'express';
import { Account } from '../entities/Account';
import { User } from '../entities/User';
import { AccountNotFoundError } from '../errors/AccountNotFoundError';
import { InvalidHeaderError } from '../errors/InvalidHeaderError';
import { UserNotFoundError } from '../errors/UserNotFoundError';

import { AuthenticatedRequest } from '../requests/AuthenticatedRequest';
import { database } from '../worker';

export const addEntityToHeader = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const { accountId, userId } = request.headers;

    if (typeof accountId !== 'string') {
      return next(new InvalidHeaderError());
    }

    const account = await database.manager.findOneById(Account, accountId);

    if (!account) {
      return next(new AccountNotFoundError());
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
      account,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};
