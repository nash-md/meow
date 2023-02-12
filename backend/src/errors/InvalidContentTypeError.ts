import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class InvalidContentTypeError extends ApplicationError {
  constructor(description?: string) {
    super(
      InvalidContentTypeError.name,
      StatusCodes.UNSUPPORTED_MEDIA_TYPE,
      description
    );
  }
}
