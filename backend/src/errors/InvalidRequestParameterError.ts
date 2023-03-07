import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidRequestParameterError extends ApplicationError {
  constructor(description?: string) {
    super(
      InvalidRequestParameterError.name,
      StatusCodes.BAD_REQUEST,
      description
    );
  }
}
