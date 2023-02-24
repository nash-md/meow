import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidCardPropertyError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidCardPropertyError.name, StatusCodes.BAD_REQUEST, description);
  }
}
