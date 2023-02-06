import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { ApplicationError } from './ApplicationError';

export class InvalidUserPropertyError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidUserPropertyError.name, StatusCodes.BAD_REQUEST, description);
  }
}
