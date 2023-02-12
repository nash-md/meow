import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidUrlError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidUrlError.name, StatusCodes.BAD_REQUEST, description);
  }
}
