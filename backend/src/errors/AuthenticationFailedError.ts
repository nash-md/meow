import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class AuthenticationFailedError extends ApplicationError {
  constructor(description?: string) {
    super(
      AuthenticationFailedError.name,
      StatusCodes.UNAUTHORIZED,
      description
    );
  }
}
