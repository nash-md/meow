import { Request, Response, NextFunction } from 'express';
import { InvalidTokenError } from '../errors/InvalidTokenError.js';
import { TokenHelper } from '../helpers/TokenHelper.js';

export const verifyJwt = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const token = request.get('Token');

  if (!token) {
    return next(new InvalidTokenError('no token provided'));
  }

  try {
    const payload = TokenHelper.verifyJwt(token);

    request.headers.userId = payload.userId;
    request.headers.accountId = payload.accountId;

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      switch (error.name) {
        case 'JsonWebTokenError':
          return next(new InvalidTokenError('token payload invalid'));
        case 'TokenExpiredError':
          return next(new InvalidTokenError('token expired'));
        case 'NotBeforeError':
          return next(new InvalidTokenError('token invalid - nbf claim'));
        default:
          return next(new InvalidTokenError('token invalid'));
      }
    } else {
      return next(error);
    }
  }
};
