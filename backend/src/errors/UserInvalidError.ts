import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError';

export class UserInvalidError extends ApplicationError {
  constructor(description?: string) {
    super(
      UserInvalidError.name,
      StatusCodes.INTERNAL_SERVER_ERROR,
      description
    );
  }
}
