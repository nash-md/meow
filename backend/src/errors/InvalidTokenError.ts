import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidTokenError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidTokenError.name, StatusCodes.UNAUTHORIZED, description);
  }
}
