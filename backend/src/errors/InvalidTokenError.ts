import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError';

export class InvalidTokenError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidTokenError.name, StatusCodes.UNAUTHORIZED, description);
  }
}
