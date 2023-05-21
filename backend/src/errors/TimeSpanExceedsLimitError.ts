import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class TimeSpanExceedsLimitError extends ApplicationError {
  constructor(description?: string) {
    super(TimeSpanExceedsLimitError.name, StatusCodes.BAD_REQUEST, description);
  }
}
