import { Request, Response, NextFunction } from 'express';
import { DateTime, Interval } from 'luxon';

export const setHeaders = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const singularity = Interval.fromDateTimes(
    DateTime.now(),
    DateTime.local(2045, 1, 1)
  ).length('days');

  response.setHeader('Magic', 'true');
  response.setHeader('Creator', 'Unicorn');
  response.setHeader('Singularity', `${Math.floor(singularity)}-days`);

  next();
};
