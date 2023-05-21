import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidRequestQueryParameterError extends ApplicationError {
  constructor(description?: string) {
    super(
      InvalidRequestQueryParameterError.name,
      StatusCodes.BAD_REQUEST,
      description
    );
  }
}
