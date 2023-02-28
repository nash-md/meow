import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidSchemaPropertyError extends ApplicationError {
  constructor(description?: string) {
    super(
      InvalidSchemaPropertyError.name,
      StatusCodes.BAD_REQUEST,
      description
    );
  }
}
