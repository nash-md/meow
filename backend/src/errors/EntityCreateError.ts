import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class EntityCreateError extends ApplicationError {
  constructor(description?: string) {
    super(EntityCreateError.name, StatusCodes.INTERNAL_SERVER_ERROR, description);
  }
}
