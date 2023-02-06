import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { ApplicationError } from './ApplicationError';

export class InvalidContentTypeError extends ApplicationError {
  constructor(description?: string) {
    super(
      InvalidContentTypeError.name,
      StatusCodes.UNSUPPORTED_MEDIA_TYPE,
      description
    );
  }
}
