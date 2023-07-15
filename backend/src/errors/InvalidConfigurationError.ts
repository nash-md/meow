import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidConfigurationError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidConfigurationError.name, StatusCodes.BAD_REQUEST, description);
  }
}
