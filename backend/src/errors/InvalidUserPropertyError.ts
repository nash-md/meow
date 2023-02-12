import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidUserPropertyError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidUserPropertyError.name, StatusCodes.BAD_REQUEST, description);
  }
}
