import { StatusCodes } from 'http-status-codes';
import { ApplicationError } from './ApplicationError.js';

export class AccountNotFoundError extends ApplicationError {
  constructor(description?: string) {
    super(AccountNotFoundError.name, StatusCodes.NOT_FOUND, description);
  }
}
