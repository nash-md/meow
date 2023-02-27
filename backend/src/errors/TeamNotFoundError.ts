import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class TeamNotFoundError extends ApplicationError {
  constructor(description?: string) {
    super(TeamNotFoundError.name, StatusCodes.NOT_FOUND, description);
  }
}
