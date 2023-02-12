import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidHeaderError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidHeaderError.name, StatusCodes.BAD_REQUEST, description);
  }
}
