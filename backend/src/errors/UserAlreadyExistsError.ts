import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError';

export class UserAlreadyExistsError extends ApplicationError {
  constructor(description?: string) {
    super(UserAlreadyExistsError.name, StatusCodes.CONFLICT, description);
  }
}
