import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError';

export class InvalidUrlError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidUrlError.name, StatusCodes.BAD_REQUEST, description);
  }
}
