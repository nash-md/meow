import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class UserAlreadyExistsError extends ApplicationError {
  constructor(description?: string) {
    super(UserAlreadyExistsError.name, StatusCodes.CONFLICT, description);
  }
}
