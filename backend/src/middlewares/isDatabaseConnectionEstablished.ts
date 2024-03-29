import { Request, Response, NextFunction } from 'express';
import { DatabaseConnectionError } from '../errors/DatabaseConnectionError.js';
import { DatabaseHelper } from '../helpers/DatabaseHelper.js';

export const isDatabaseConnectionEstablished = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!DatabaseHelper.isInitialized()) {
    return next(
      new DatabaseConnectionError(
        'The UI could connect to the backend, however the database connection was not established. Check if your database is running and if the connection is configured correctly'
      )
    );
  } else {
    return next();
  }
};
