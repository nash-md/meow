import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class DatabaseConnectionError extends ApplicationError {
  constructor(description?: string) {
    super(
      DatabaseConnectionError.name,
      StatusCodes.INTERNAL_SERVER_ERROR,
      description
    );
  }
}
