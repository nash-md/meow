import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class CreateEntityError extends ApplicationError {
  constructor(description?: string) {
    super(CreateEntityError.name, StatusCodes.INTERNAL_SERVER_ERROR, description);
  }
}
