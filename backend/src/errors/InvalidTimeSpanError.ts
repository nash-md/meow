import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidTimeSpanError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidTimeSpanError.name, StatusCodes.BAD_REQUEST, description);
  }
}
