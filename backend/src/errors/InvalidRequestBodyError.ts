import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidRequestBodyError extends ApplicationError {
  constructor(description?: string) {
    super(InvalidRequestBodyError.name, StatusCodes.BAD_REQUEST, description);
  }
}
