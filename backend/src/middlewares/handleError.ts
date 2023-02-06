import { Request, Response, NextFunction } from 'express';
import { ApplicationError } from '../errors/ApplicationError';
import { log } from '../logger';

export const handleError = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApplicationError) {
    res.set('Content-Type', 'application/json');
    res.status(error.code).json(error.toResponse());
  } else {
    log.error(error);
    res.status(500).end();
  }
};
