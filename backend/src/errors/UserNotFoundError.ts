import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError';

export class UserNotFoundError extends ApplicationError {
  constructor(description?: string) {
    super(UserNotFoundError.name, StatusCodes.NOT_FOUND, description);
  }
}
