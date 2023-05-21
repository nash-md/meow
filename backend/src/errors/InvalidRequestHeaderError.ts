import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidRequestHeaderError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidRequestHeaderError.name, StatusCodes.BAD_REQUEST, description);
  }
}
