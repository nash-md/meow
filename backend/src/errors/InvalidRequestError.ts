import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidRequestError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidRequestError.name, StatusCodes.BAD_REQUEST, description);
  }
}
