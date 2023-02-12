import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class EntityNotFoundError extends ApplicationError {
  constructor(description?: string) {
    super(EntityNotFoundError.name, StatusCodes.NOT_FOUND, description);
  }
}
