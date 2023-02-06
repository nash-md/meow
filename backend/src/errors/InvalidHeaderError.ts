import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { ApplicationError } from './ApplicationError';

export class InvalidHeaderError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidHeaderError.name, StatusCodes.BAD_REQUEST, description);
  }
}
