import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class LaneNotFoundError extends ApplicationError {
  constructor(description?: string) {
    super(LaneNotFoundError.name, StatusCodes.NOT_FOUND, description);
  }
}
